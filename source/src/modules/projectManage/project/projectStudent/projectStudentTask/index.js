import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { projectTaskState } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag } from 'antd';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { commonMessage } from '@locales/intl';
import { Button } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import styles from '@modules/projectManage/project/project.module.scss';


import useFetch from '@hooks/useFetch';
import { FieldTypes } from '@constants/formConfig';
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
});

function ProjectStudentTaskListPage() {
    const translate = useTranslate();
    const navigate = useNavigate();

    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);

    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');

    const leaderName = queryParameters.get('leaderName');
    const developerName = queryParameters.get('developerName');
    const active = queryParameters.get('active');

    const stateValues = translate.formatKeys(projectTaskState, ['label']);

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
                funcs.getList = () => {
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({ ...params, projectName:null });
                };
                funcs.additionalActionColumnButtons = () => ({
                    taskLog: ({ id,taskName }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.taskLog)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.projectStudentTaskListPage.path +
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
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            width: 200,
            align: 'center',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'dueDate',
            width: 200,
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
            { taskLog: true, edit:true, delete:true },
            { width: '150px' },
        ),
    ].filter(Boolean);

    const { data: memberProject } = useFetch(apiConfig.memberProject.autocomplete, {
        immediate: true,
        params:{ projectId:projectId },
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item?.developer?.id,
                label: item?.developer?.studentInfo?.fullName,
            })),
    });

    const searchFields = [
        {
            key: 'taskName',
            placeholder: translate.formatMessage(commonMessage.task),
        },
        {
            key: 'developerId',
            placeholder: <FormattedMessage defaultMessage={"Lập trình viên"} />,
            type: FieldTypes.SELECT,
            options:  memberProject,
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
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
                    path: generatePath(routes.projectStudentListPage.path),
                },
                { breadcrumbName: translate.formatMessage(message.projectTask) },
            ]}
        >
            <div>
                <ListPage
                    title={<span style={{ fontWeight: 'normal' }}>{projectName}</span>}
                    searchForm={mixinFuncs.renderSearchForm({
                        fields: searchFields,
                        className: styles.search,
                    })}
                    actionBar={active && !leaderName && !developerName && mixinFuncs.renderActionBar()}
                    baseTable={
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                        />
                    }
                />
            </div>
        </PageWrapper>
    );
}
export default ProjectStudentTaskListPage;
