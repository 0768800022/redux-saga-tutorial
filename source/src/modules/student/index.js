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
    fullName: 'Họ Và Tên',
    home:'Trang Chủ',
    student:'Sinh Viên',
});

const StudentListPage = () => {
    const translate = useTranslate();

    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.student,
        // options:{},
        override: (funcs) => {
            funcs.mappingData = (response) => {
                console.log('response',response);
                if(response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
        },
    });

    const columns = [
        {
            title: <FormattedMessage defaultMessage='Họ Và Tên'/>,
            dataIndex: 'fullName',
        },
        {
            title: <FormattedMessage defaultMessage='Ngày Sinh'/>,
            dataIndex: 'birthday',
            render: (birthday) => {
                const result = birthday.split(" ").shift();
                return <div>{result}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage='MSSV'/>,
            dataIndex: 'mssv',
        },
        {
            title: <FormattedMessage defaultMessage='Số Điện Thoại'/>,
            dataIndex: 'phone',
        },
        {
            title: <FormattedMessage defaultMessage='Email'/>,
            dataIndex: 'email',
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '90px' }),
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