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
    objectName: 'Danh sách đăng kí khóa học',
    studentId: 'Tên sinh viên',
    home: 'Trang chủ',
    courseid: 'courseId',
    createDate: 'Ngày đăng kí',
    isIntern: 'Đăng kí thực tập',
    course: 'Khóa học',
    registration: 'Danh sách sinh viên đăng kí khóa học',
});

function RegistrationListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseState = queryParameters.get('courseState');
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.registration,
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
                return `${pagePath}/create?courseId=${courseId}&courseName=${courseName}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?courseId=${courseId}&courseName=${courseName}`;
            };
        },
    });

    const columns = [
        {
            title: translate.formatMessage(message.studentId),
            dataIndex: ['studentInfo', 'fullName'],
        },
        {
            title: 'Lịch trình',
            dataIndex: 'schedule',
            render: (schedule) => {
                let check = JSON.parse(schedule);
                const newCheck = [
                    { key: 'M', value: check.t2 },
                    { key: 'T', value: check.t3 },
                    { key: 'W', value: check.t4 },
                    { key: 'T', value: check.t5 },
                    { key: 'F', value: check.t6 },
                    { key: 'S', value: check.t7 },
                    { key: 'S', value: check.cn },
                ];

                let dateString = '';
                newCheck.map((item) => {
                    if (item.value !== undefined) {
                        dateString += item.key + ' ';
                    }
                });

                return <div>{dateString}</div>;
            },
            width: 110,
        },
        {
            title: translate.formatMessage(message.isIntern),
            dataIndex: 'isIntern',
            align: 'center',
            width: 150,
            render: (item) => {
                let text;
                if (item == 1) {
                    text = 'Có';
                } else {
                    text = 'Không';
                }
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{text}</div>;
            },
        },
        {
            title: translate.formatMessage(message.createDate),
            dataIndex: 'createdDate',
            align: 'center',
            width: 170,
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: 110 }),
    ];

    const searchFields = [
        {
            key: 'id',
            placeholder: translate.formatMessage(message.studentId),
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                {
                    breadcrumbName: translate.formatMessage(message.course),
                    path: '/course',
                },
                { breadcrumbName: translate.formatMessage(message.registration) },
            ]}
        >
            <ListPage
                // searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                title={
                    <p style={{ fontSize: '18px' }}>
                        Tên khóa học: <span style={{ fontWeight: 'normal' }}>{courseName}</span>
                    </p>
                }
                actionBar={courseState == 5 && mixinFuncs.renderActionBar()}
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

export default RegistrationListPage;
