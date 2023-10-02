import ListPage from '@components/common/layout/ListPage';
import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';

const message = defineMessages({
    name: 'Tên khoá học',
    home: 'Trang chủ',
    subject: 'Môn học',
    objectName: 'course',
    course: 'Khoá học',
    description: 'Mô tả',
    dateRegister: 'Ngày bắt đầu',
    dateEnd: 'Ngày kết thúc',
});

const CourseListPage = () => {
    const translate = useTranslate();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.course,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
    });
    const breadRoutes = [
        { breadcrumbName: translate.formatMessage(message.home) },
        { breadcrumbName: translate.formatMessage(message.course) },
    ];
    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
        },
    ];
    const columns = [
        {
            title: translate.formatMessage(message.name),
            dataIndex: 'name',
            width: 200,
        },
        {
            title: translate.formatMessage(message.subject),
            dataIndex: ['subject', 'name'],
            width: 200,
        },
        {
            title: translate.formatMessage(message.dateRegister),
            dataIndex: 'dateRegister',
            render: (dateRegister) => {
                const modifiedDate = dayjs(dateRegister, 'DD/MM/YYYY');
                const modifiedDateTimeString = modifiedDate.format('DD/MM/YYYY');
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateTimeString}</div>;
            },
            width: 200,
            align: 'center',
        },
        {
            title: translate.formatMessage(message.dateEnd),
            dataIndex: 'dateEnd',
            render: (dateEnd) => {
                const modifiedDate = dayjs(dateEnd, 'DD/MM/YYYY');
                const modifiedDateTimeString = modifiedDate.format('DD/MM/YYYY');
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateTimeString}</div>;
            },
            width: 200,
            align: 'center',
        },

        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];
    console.log(data);
    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
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
};

export default CourseListPage;
