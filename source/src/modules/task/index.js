import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
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

const message = defineMessages({
    objectName: 'Danh sách khóa học',
    studentId: 'Tên sinh viên',
    home: 'Trang chủ',
    lecture: 'Bài giảng',
    subject: 'Môn học',
    task: 'Task',
    course: 'Khóa học',
});

function TaskListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.task,
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
                return `${pagePath}/lecture`;
            };
        },
    });
    const columns = [
        {
            title: translate.formatMessage(message.studentId),
            dataIndex: ['student', 'fullName'],
        },
        {
            title: translate.formatMessage(message.subject),
            dataIndex: ['lecture', 'subject', 'subjectName'],
            align: 'center',
        },
        {
            title: translate.formatMessage(message.lecture),
            dataIndex: ['lecture', 'lectureName'],
            align: 'center',
        },
        mixinFuncs.renderActionColumn({ edit: false, delete: true }, { width: '120px' }),
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                {
                    breadcrumbName: translate.formatMessage(message.course),
                    path: generatePath(routes.courseListPage.path),
                },
                { breadcrumbName: translate.formatMessage(message.task) },
            ]}
        >
            <ListPage
                // searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
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
        </PageWrapper>
    );
}

export default TaskListPage;
