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
import { EditOutlined } from '@ant-design/icons';

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

function ProjectTaskListPage() {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const leaderId = queryParameters.get('leaderId');
    const leaderName = queryParameters.get('leaderName');
    const developerName = queryParameters.get('developerName');
    const active = queryParameters.get('active');
    const state = queryParameters.get('state');

    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const location = useLocation();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.projectTask,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    try {
                        if (response.result === true) {
                            return {
                                data: response.data.content,
                                total: response.data.totalElements,
                            };
                        }
                    } catch (error) {
                        return [];
                    }
                };
                funcs.getCreateLink = () => {
                    return `${pagePath}/create?projectId=${projectId}&projectName=${projectName}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/${dataRow.id}?projectId=${projectId}&projectName=${projectName}`;
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
            },
        });
    const setColumns = () => {
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
        ];
        if (!leaderName && !developerName ) {
            columns.push(mixinFuncs.renderStatusColumn({ width: '120px' }));
            if (active)
                columns.push(mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }));
        }
        return columns;
    };

    const setSearchField = () => {
        let searchFields = [
            {
                key: 'taskName',
                placeholder: translate.formatMessage(message.name),
            },
            {
                key: 'state',
                placeholder: translate.formatMessage(message.state),
                type: FieldTypes.SELECT,
                options: stateValues,
            },
        ];
        !leaderName &&
            !developerName &&
            searchFields.splice(1, 0, {
                key: 'status',
                placeholder: translate.formatMessage(message.status),
                type: FieldTypes.SELECT,
                options: statusValues,
            });
        return searchFields;
    };

    const setBreadRoutes = () => {
        const breadRoutes = [{ breadcrumbName: translate.formatMessage(message.home) }];
        if (leaderName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.leader),
                path: routes.leaderListPage.path,
            });
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.project),
                path: generatePath(routes.leaderProjectListPage.path + location?.state?.pathPrev),
            });
        } else if (developerName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.developer),
                path: routes.developerListPage.path,
            });
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.project),
                path: generatePath(routes.developerProjectListPage.path + location?.state?.pathPrev),
            });
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.project),
                path: generatePath(routes.projectListPage.path),
            });
        }
        breadRoutes.push({ breadcrumbName: translate.formatMessage(message.projectTask) });

        return breadRoutes;
    };

    return (
        <PageWrapper routes={setBreadRoutes()}>
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
                    searchForm={mixinFuncs.renderSearchForm({ fields: setSearchField(), initialValues: queryFilter })}
                    actionBar={active && !leaderName && !developerName && mixinFuncs.renderActionBar()}
                    baseTable={
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={setColumns()}
                        />
                    }
                />
            </div>
        </PageWrapper>
    );
}
export default ProjectTaskListPage;
