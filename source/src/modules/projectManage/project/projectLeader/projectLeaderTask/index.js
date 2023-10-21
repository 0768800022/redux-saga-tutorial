import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { projectTaskState, statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag, Button } from 'antd';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import ChangeStateModal from './ChangeStateModal';
import useDisclosure from '@hooks/useDisclosure';
import { useState } from 'react';
import useFetch from '@hooks/useFetch';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { CalendarOutlined } from '@ant-design/icons';
import { commonMessage } from '@locales/intl';
import { DEFAULT_FORMAT, DATE_FORMAT_DISPLAY, AppConstants } from '@constants';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
const message = defineMessages({
    objectName: 'Task',
    developer: 'Lập trình viên',
    home: 'Trang chủ',
    state: 'Tình trạng',
    projectTask: 'Task',
    project: 'Dự án',
    leader: 'Leader',
    name: 'Tên task',
    status: 'Trạng thái',
    startDate: 'Ngày bắt đầu',
});

function ProjectLeaderTaskListPage() {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const [introduceData, setIntroduceData] = useState({});
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const leaderId = queryParameters.get('leaderId');
    const leaderName = queryParameters.get('leaderName');
    const developerName = queryParameters.get('developerName');
    const active = queryParameters.get('active');
    const state = queryParameters.get('state');
    const [openedIntroduceModal, handlersIntroduceModal] = useDisclosure(false);
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const location = useLocation();
    const [detail, setDetail] = useState();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { execute: executeUpdate } = useFetch(apiConfig.projectTask.changeState, { immediate: false });

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.projectTask,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                };
                funcs.getCreateLink = () => {
                    return `${pagePath}/create?projectId=${projectId}&projectName=${projectName}&active=${active}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/${dataRow.id}?projectId=${projectId}&projectName=${projectName}&active=${active}`;
                };
                funcs.changeFilter = (filter) => {
                    const projectId = queryParams.get('projectId');
                    const projectName = queryParams.get('projectName');
                    const developerName = queryParams.get('developerName');
                    const leaderName = queryParams.get('leaderName');
                    let filterAdd;
                    if (developerName) {
                        filterAdd = { developerName };
                    } else if (leaderName) {
                        filterAdd = { leaderName };
                    }
                    if (filterAdd) {
                        mixinFuncs.setQueryParams(
                            serializeParams({
                                projectId: projectId,
                                projectName: projectName,
                                ...filterAdd,
                                ...filter,
                            }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(
                            serializeParams({ projectId: projectId, projectName: projectName, ...filter }),
                        );
                    }
                };

                funcs.additionalActionColumnButtons = () => ({
                    editSetting: (item) => {
                        return (
                            <Button
                                type="link"
                                disabled={item.status !== 1}
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDetail(item);
                                    setIntroduceData(item);
                                    handlersIntroduceModal.open();
                                }}
                            >
                                <CheckOutlined />
                            </Button>
                        );
                    },
                    taskLog: ({ id,taskName }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.taskLog)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.projectLeaderTaskListPage.path +
                                            `/task-log?projectId=${projectId}&projectName=${projectName}&taskId=${id}&taskName=${taskName}&active=${active}`,
                                        {
                                            state: { action: 'projectTaskLog', prevPath: location.pathname },
                                        },
                                    );
                                }}
                            >
                                <CalendarOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                });
            },
        });

    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };
    const columns = [
        {
            title: translate.formatMessage(message.projectTask),
            dataIndex: 'taskName',
        },
        {
            title: translate.formatMessage(message.developer),
            dataIndex: ['developer', 'studentInfo', 'fullName'],
        },
        {
            title: <FormattedMessage defaultMessage="Quản lý" />,
            dataIndex: ['project', 'leaderInfo', 'leaderName'],
        },
        {
            title: translate.formatMessage(message.startDate),
            dataIndex: 'startDate',
            render: (startDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate)}</div>;
            },
            width: 200,
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'dueDate',
            render: (dueDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(dueDate)}</div>;
            },
            width: 200,
            align: 'center',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },

        mixinFuncs.renderActionColumn({ taskLog: true, editSetting: true }, { width: '120px' }),
    ].filter(Boolean);
    const params = mixinFuncs.prepareGetListParams(queryFilter);
    const {
        data: listSetting,
        loading: dataLoading,
        execute: executeLoading,
    } = useFetch(apiConfig.projectTask.getList, {
        immediate: false,
        params: { ...params },
        mappingData: (response) => {
            if (response.result === true) {
                return {
                    data: response.data.content,
                };
            }
        },
    });

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.project),
                    path: generatePath(routes.projectLeaderListPage.path),
                },
                { breadcrumbName: translate.formatMessage(message.projectTask) },
            ]}
        >
            <div>
                <ListPage
                    title={
                        <span
                            style={
                                leaderName || developerName
                                    ? { fontWeight: 'normal', fontSize: '16px' }
                                    : { fontWeight: 'normal', fontSize: '16px', position: 'absolute' }
                            }
                        >
                            {projectName}
                        </span>
                    }
                    actionBar={active && !leaderName && !developerName && mixinFuncs.renderActionBar()}
                    baseTable={
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={listSetting ? listSetting?.data : data}
                            columns={columns}
                        />
                    }
                />
                <ChangeStateModal
                    open={openedIntroduceModal}
                    onCancel={() => handlersIntroduceModal.close()}
                    introduceData={introduceData}
                    data={detail || {}}
                    executeUpdate={executeUpdate}
                    executeLoading={executeLoading}
                    width={200}
                />
            </div>
        </PageWrapper>
    );
}
export default ProjectLeaderTaskListPage;
