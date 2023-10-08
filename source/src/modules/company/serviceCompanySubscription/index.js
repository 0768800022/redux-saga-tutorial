import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants/index';
import { formatMoney } from '@utils/index';
const message = defineMessages({
    objectName: 'Company',
    serviceCompanySubscription: 'Quản lý gói dịch vụ',
    home: 'Trang chủ',
    name: 'Tên dịch vụ',
    price: 'Giá',
    status:'Trạng thái',
    valueable: 'Số ngày sử dụng',
    
});

const ServiceCompanySubListPage = () => {
    const translate = useTranslate();
    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.serviceCompanySubscription,
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
        },
    });

    const columns = [
        
        {
            title: <FormattedMessage defaultMessage="Tên dịch vụ" />,
            dataIndex: 'name',
        },
        {
            title: <FormattedMessage defaultMessage="Giá" />,
            dataIndex: 'price',
            render: (price) => {
                const formattedValue = formatMoney(price, {
                    groupSeparator: '.',      
                    decimalSeparator: ',',    
                    currentcy: 'đ',            
                    currentcyPosition: 'BACK', 
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Số ngày sử dụng" />,
            dataIndex: 'valueable',
        },
        mixinFuncs.renderActionColumn({ task:true, edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
        },
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.serviceCompanySubscription) },
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
export default ServiceCompanySubListPage;
