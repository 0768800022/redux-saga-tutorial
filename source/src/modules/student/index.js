import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';
import { convertUtcToLocalTime } from '@utils/index';
import { TeamOutlined, BookOutlined } from '@ant-design/icons';
import route from '@modules/student/routes';
import { useNavigate } from 'react-router-dom';
import { Button, Tag } from 'antd';

const message = defineMessages({
    objectName: 'Student',
    fullName: 'Họ và tên',
    home: 'Trang chủ',
    student: 'Sinh viên',
    mssv: 'Mã số sinh viên',
});

const StudentListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.student,
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
            funcs.additionalActionColumnButtons = () => ({
                task: ({ id, name }) => (
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(route.studentCourseListPage.path + `?studentId=${id}`);
                            // navigate(route.studentCourseListPage.path);
                            // navigate(`./course/${id}`);
                            // navigate(route.taskListPage.path + `?courseId=${id}&courseName=${name}`);
                        }}
                    >
                        <BookOutlined />
                    </Button>
                ),
            });
        },
    });

    const columns = [
        {
            title: <FormattedMessage defaultMessage="Họ và tên" />,
            dataIndex: 'fullName',
        },
        {
            title: <FormattedMessage defaultMessage="Ngày sinh" />,
            dataIndex: 'birthday',
            render: (birthday) => {
                const result = convertUtcToLocalTime(birthday, DEFAULT_FORMAT, DATE_FORMAT_VALUE);
                return <div>{result}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Mã số sinh viên" />,
            dataIndex: 'mssv',
        },
        {
            title: <FormattedMessage defaultMessage="Số điện thoại" />,
            dataIndex: 'phone',
        },
        {
            title: <FormattedMessage defaultMessage="Email" />,
            dataIndex: 'email',
        },
        {
            title: <FormattedMessage defaultMessage="Trường" />,
            dataIndex: ['university', 'categoryName'],
        },
        {
            title: <FormattedMessage defaultMessage="Hệ" />,
            dataIndex: ['studyClass', 'categoryName'],
        },
        mixinFuncs.renderActionColumn({ task:true, edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'fullName',
            placeholder: translate.formatMessage(message.fullName),
        },
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.student) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            ></ListPage>
        </PageWrapper>
    );
};
export default StudentListPage;
