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
import { Tag, Button, Modal } from 'antd';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import useDisclosure from '@hooks/useDisclosure';
import { useState } from 'react';
import useFetch from '@hooks/useFetch';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { CalendarOutlined } from '@ant-design/icons';
import { commonMessage } from '@locales/intl';
import useNotification from '@hooks/useNotification';
import { useIntl } from 'react-intl';
import styles from '@modules/projectManage/project/project.module.scss';

import { DEFAULT_FORMAT, DATE_FORMAT_DISPLAY, AppConstants } from '@constants';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import DetailMyTaskProjectModal from '../../projectStudent/myTask/DetailMyTaskProjectModal';

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
    updateTaskSuccess: 'Cập nhật tình trạng thành công',
    done: 'Hoàn thành',
});

function ProjectLeaderTaskListPage() {
    const translate = useTranslate();
    const navigate = useNavigate();
    const intl = useIntl();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const [introduceData, setIntroduceData] = useState({});
    const [openedModal, handlersModal] = useDisclosure(false);

    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const leaderId = queryParameters.get('leaderId');
    const leaderName = queryParameters.get('leaderName');
    const developerName = queryParameters.get('developerName');
    const active = queryParameters.get('active');
    const state = queryParameters.get('state');
    const notification = useNotification();

    const [openedStateTaskModal, handlersStateTaskModal] = useDisclosure(false);

    const [openedIntroduceModal, handlersIntroduceModal] = useDisclosure(false);
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const location = useLocation();
    const [detail, setDetail] = useState();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { execute: executeGet, loading: loadingDetail } = useFetch(apiConfig.projectTask.getById, {
        immediate: false,
    });
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
                    taskLog: ({ id, taskName }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.taskLog)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.projectLeaderTaskListPage.path +
                                        `/task-log?projectId=${projectId}&projectName=${projectName}&projectTaskId=${id}&task=${taskName}&active=${active}`,
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
                    state: (item) => (
                        <BaseTooltip title={translate.formatMessage(message.done)}>
                            <Button
                                type="link"
                                disabled={item.state === 3}
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDetail(item);
                                    handlersStateTaskModal.open();
                                }}
                            >
                                <CheckOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                });
            },
        });
    const handleFetchDetail = (id) => {
        executeGet({
            pathParams: { id: id },
            onCompleted: (response) => {
                setDetail(response.data);
            },
            onError: mixinFuncs.handleGetDetailError,
        });
    };
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

        mixinFuncs.renderActionColumn(
            { taskLog: true, state: true, edit: active && true, delete: active && true },
            { width: '150px' },
        ),
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
    const { execute: executeUpdate } = useFetch(apiConfig.projectTask.changeState, { immediate: false });

    const handleOk = () => {
        handlersStateTaskModal.close();
        updateState(detail);
    };
    const updateState = (values) => {
        executeUpdate({
            data: {
                id: values.id,
                state: 3,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    mixinFuncs.getList();
                    notification({
                        message: intl.formatMessage(message.updateTaskSuccess),
                    });
                    handlersStateTaskModal.close();
                }
            },
            onError: (err) => { },
        });
    };

    const { data: memberProject } = useFetch(apiConfig.memberProject.autocomplete, {
        immediate: true,
        params: { projectId: projectId },
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item?.developer?.id,
                label: item?.developer?.studentInfo?.fullName,
            })),
    });

    const searchFields = [
        // {
        //     key: 'taskName',
        //     placeholder: translate.formatMessage(commonMessage.task),
        // },
        {
            key: 'developerId',
            placeholder: <FormattedMessage defaultMessage={"Lập trình viên"} />,
            type: FieldTypes.SELECT,
            options: memberProject,
        },
        // !leaderName &&
        //     !developerName && {
        //     key: 'status',
        //     placeholder: translate.formatMessage(commonMessage.status),
        //     type: FieldTypes.SELECT,
        //     options: statusValues,
        // },
    ].filter(Boolean);

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
                    searchForm={mixinFuncs.renderSearchForm({
                        fields: searchFields,
                        className: styles.search,
                    })}
                    actionBar={active && !leaderName && !developerName && mixinFuncs.renderActionBar()}
                    baseTable={
                        <BaseTable
                            onRow={(record) => ({
                                onClick: (e) => {
                                    e.stopPropagation();
                                    handleFetchDetail(record.id);

                                    handlersModal.open();
                                },
                            })}
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={listSetting ? listSetting?.data : data}
                            columns={columns}
                        />
                    }
                />
                <Modal title="Thay đổi tình trạng hoàn thành" open={openedStateTaskModal} onOk={handleOk} onCancel={() => handlersStateTaskModal.close()} data={detail || {}}>
                </Modal>
                <DetailMyTaskProjectModal
                    open={openedModal}
                    onCancel={() => handlersModal.close()}
                    DetailData={detail}
                />
            </div>
        </PageWrapper>
    );
}
export default ProjectLeaderTaskListPage;
