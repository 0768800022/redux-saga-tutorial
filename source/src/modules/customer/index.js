import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';

import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { stateOptions, statusOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { Button, Tag } from 'antd';
import { defineMessages } from 'react-intl';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link, generatePath, useNavigate, useParams } from 'react-router-dom';
import routes from './routes';

const messages = defineMessages({
    home: 'Home',
    name: 'Name',
    phone: 'Phone',
    customer: 'Customer',
});

const CustomerListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { restaurantId } = useParams();
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.customer,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(messages.customer),
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
            funcs.additionalActionColumnButtons = () => {
                return {
                    viewOrder: ({ buttonProps, ...dataRow }) => {
                        return (
                            <Button
                                {...buttonProps}
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        generatePath(routes.customerOrderListPage.path, {
                                            phone: dataRow.phone,
                                            restaurantId,
                                        }),
                                    );
                                }}
                                style={{ padding: 0 }}
                            >
                                <ShoppingCartOutlined />
                            </Button>
                        );
                    },
                };
            };
        },
    });

    const columns = [
        {
            title: translate.formatMessage(messages.name),
            dataIndex: 'name',
        },
        {
            title: translate.formatMessage(messages.phone),
            dataIndex: 'phone',
        },
        mixinFuncs.renderActionColumn({ viewOrder: true, edit: true, delete: true }, { width: '150px' }),
    ];

    const searchFields = [
        {
            key: 'customerName',
            placeholder: translate.formatMessage(messages.name),
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                { breadcrumbName: translate.formatMessage(messages.customer) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        className={'customer-table'}
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    navigate(
                                        generatePath(routes.customerOrderListPage.path, {
                                            phone: record.phone,
                                            restaurantId,
                                        }),
                                    );
                                },
                            };
                        }}
                    />
                }
            />
        </PageWrapper>
    );
};

export default CustomerListPage;
