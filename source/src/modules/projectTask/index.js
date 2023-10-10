import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { AppConstants, DATE_DISPLAY_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import useDrapDropTableItem from '@hooks/useDrapDropTableItem';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar, Button, Tag } from 'antd';
import React from 'react';
import { Link, generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { defineMessages, FormattedMessage } from 'react-intl';
import { date } from 'yup/lib/locale';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { projectTaskState } from '@constants/masterData';

const message = defineMessages({
    objectName: 'Danh sách khóa học',
    developer: 'Lập trình viên',
    home: 'Trang chủ',
    state: 'Trạng thái',
    projectTask: 'Task',
    project: 'Dự án',
    leader: 'Leader',
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
    const state = queryParameters.get('state');
    const location = useLocation();
    console.log(location);
    const statusValues = translate.formatKeys(projectTaskState, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
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
                title: translate.formatMessage(message.leader),
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
                title: 'Trạng thái',
                dataIndex: 'state',
                align: 'center',
                width: 120,
                render(dataRow) {
                    const status = statusValues.find((item) => item.value == dataRow);
                    return <Tag color={status.color}>{status.label}</Tag>;
                },
            },
        ];
        if (!leaderName && !developerName) {
            columns.push(mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }));
        }
        return columns;
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
                    actionBar={!leaderName && !developerName && mixinFuncs.renderActionBar()}
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
