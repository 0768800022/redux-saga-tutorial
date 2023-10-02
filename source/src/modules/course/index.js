import ListPage from '@components/common/layout/ListPage';
import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';

const message = defineMessages({
    name: 'Name',
    home: 'Home',
    subject: 'Subject',
    objectName: 'course',
    course: 'Course',
    description: 'Description',
    id: 'Id',
});

const CourseListPage = () => {
    const translate = useTranslate();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.category,
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
            title: translate.formatMessage(message.id),
            dataIndex: 'id',
            width: 200,
        },
        {
            title: translate.formatMessage(message.name),
            dataIndex: 'name',
            width: 200,
        },
        {
            title: translate.formatMessage(message.subject),
            dataIndex: 'subject',
            width: 200,
        },

        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];
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
