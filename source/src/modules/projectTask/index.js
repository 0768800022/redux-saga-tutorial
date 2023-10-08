import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { AppConstants, DATE_DISPLAY_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { taskState } from '@constants/masterData';
import useDrapDropTableItem from '@hooks/useDrapDropTableItem';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar, Button, Tag } from 'antd';
import React from 'react';
import { Link, generatePath, useLocation, useParams } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { defineMessages } from 'react-intl';
import { date } from 'yup/lib/locale';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';

const message = defineMessages({
    objectName: 'Danh sách khóa học',
    developer: 'Người thực hiện',
    home: 'Trang chủ',
    state: 'Trạng thái',
    projectTask: 'Task',
    project: 'Dự án',
});

function ProjectTaskListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const leaderId = queryParameters.get('leaderId');
    const state = queryParameters.get('state');

    const statusValues = translate.formatKeys(taskState, ['label']);
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
    const columns = [
        {
            title: translate.formatMessage(message.projectTask),
            dataIndex: 'taskName',
        },
        {
            title: translate.formatMessage(message.developer),
            dataIndex: ['developer','studentInfo', 'fullName'],
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            width: 140,
            render: (startDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(startDate, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            align: 'center',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'dueDate',
            width: 140,
            render: (dueDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(dueDate, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            align: 'center',
        },
        {
            title: translate.formatMessage(message.state),
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const status = statusValues.find((item) => item.value == dataRow);

                return <Tag color={status.color}>{status.label}</Tag>;
            },
        },

        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                {
                    breadcrumbName: translate.formatMessage(message.project),
                    path: generatePath(routes.projectListPage.path),
                },
                { breadcrumbName: translate.formatMessage(message.projectTask) },
            ]}
        >
            <div>
                <ListPage
                    title={<p style={{ fontSize: '18px' }}>Dự án: <span style={{ fontWeight: 'normal' }}>{projectName}</span></p>}
                    actionBar={mixinFuncs.renderActionBar()}
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

export default ProjectTaskListPage;
