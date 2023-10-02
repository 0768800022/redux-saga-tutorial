import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { defineMessages,FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';

const message = defineMessages({
    objectName: 'Student',
    fullname: 'Full Name',
    home:'Home',
    student:'Student',
});

const StudentListPage = () => {
    const translate = useTranslate();

    const { data, mixinFuncs, loading, pagination, queryFiter } =useListBase({
        apiConfig: apiConfig.category,
        options:{},
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if(response.result === true) {
                    return {
                        data: response.data.data,
                        total: response.data.totalElements,
                    };
                }
            };
        },
    });

    const columns = [
        {
            title: <FormattedMessage defaultMessage='Full Name'/>,
            dataIndex: 'fullname',
        },
        {
            title: <FormattedMessage defaultMessage='Birth Day'/>,
            dataIndex: 'birthday',
        },
        {
            title: <FormattedMessage defaultMessage='MSSV'/>,
            dataIndex: 'mssv',
        },
        {
            title: <FormattedMessage defaultMessage='Phone'/>,
            dataIndex: 'phone',
        },
        {
            title: <FormattedMessage defaultMessage='Email'/>,
            dataIndex: 'email',
        },
    ];

    const searchFields = [
        {
            key: 'fullname',
            placeholder: translate.formatMessage(message.fullname),
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
                searchForm = {mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
                actionBar = {mixinFuncs.renderActionBar()}
                baseTable = {
                    <BaseTable 
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            >
            </ListPage>
        </PageWrapper>
    );
};
export default StudentListPage;