import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { Link, generatePath, useNavigate, useParams } from 'react-router-dom';
import routes from './routes';
import { Button, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import ListPage from '@components/common/layout/ListPage';
import Currency from '@components/common/elements/Currency';
import { orderStateOptions, statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import DateFormat from '@components/common/elements/DateFormat';

const message = defineMessages({
    objectName: 'order',
    home: 'Home',
    order: 'List Order',
    customerName: 'Name',
    customerPhone: 'Phone',
    totalMoney: 'Total Money',
    status: 'Status',
    state: 'State',
    createdDate: 'Created Date',
    code: 'Code',
});
const OrderListPage = (props) => {
    const { customerPhone, additionRoute } = props;
    const navigate = useNavigate();
    const { restaurantId } = useParams();
    const translate = useTranslate();
    const orderStateValues = translate.formatKeys(orderStateOptions, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.order,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.content.map((item) => ({ ...item, id: item.id })),
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
            funcs.getItemDetailLink = (dataRow) => {
                return getPathSave(customerPhone, dataRow);
            };
        },
    });
    const getPathView = (customerPhone, dataRow) => {
        if (customerPhone) {
            return generatePath(routes.customerOrderViewPage.path, {
                restaurantId,
                id: dataRow.id,
                phone: customerPhone,
                type: 1,
            });
        } else {
            return generatePath(routes.orderViewPage.path, {
                restaurantId,
                id: dataRow.id,
                phone: dataRow.customerPhone,
            });
        }
    };
    const getPathSave = (customerPhone, dataRow) => {
        if (customerPhone) {
            return generatePath(routes.customerOrderSavePage.path, {
                restaurantId,
                id: dataRow.id,
                phone: customerPhone,
                type: 1,
            });
        } else {
            return generatePath(routes.orderSavePage.path, {
                restaurantId,
                id: dataRow.id,
                phone: dataRow.customerPhone,
            });
        }
    };
    const columns = [
        {
            title: translate.formatMessage(message.createdDate),
            dataIndex: 'createdDate',
            render: (data, dataRow) => <DateFormat>{data}</DateFormat>,
            width: 200,
        },
        {
            title: translate.formatMessage(message.code),
            dataIndex: 'code',
            width: 200,
        },
        {
            title: translate.formatMessage(message.totalMoney),
            dataIndex: 'totalMoney',
            width: 200,
            align: 'right',
            render: (data, dataRow) => <Currency value={data} />,
        },
        {
            title: translate.formatMessage(message.customerPhone),
            dataIndex: 'customerPhone',
            width: 120,
        },
        {
            title: translate.formatMessage(message.customerName),
            dataIndex: 'customerName',
        },
        {
            title: translate.formatMessage(message.state),
            dataIndex: 'state',
            align: 'right',
            render(dataRow) {
                const state = orderStateValues.find((item) => item.value == dataRow);
                return <Tag color={state.color}>{state.label}</Tag>;
            },
            width: 100,
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];
    const searchFields = [
        {
            key: 'orderCode',
            placeholder: translate.formatMessage(message.code),
        },
        {
            key: 'phone',
            placeholder: translate.formatMessage(message.customerPhone),
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(message.state),
            type: FieldTypes.SELECT,
            options: orderStateValues,
        },
    ];
    if (customerPhone) {
        searchFields.splice(1, 1);
        columns.splice(4, 1);
    }
    const [breadRoutes, setBreadRoutes] = useState([
        { breadcrumbName: translate.formatMessage(message.home) },
        { breadcrumbName: translate.formatMessage(message.order) },
    ]);
    useEffect(() => {
        if (additionRoute) {
            setBreadRoutes(() => {
                let result = [
                    { breadcrumbName: translate.formatMessage(message.home) },
                    additionRoute,
                    { breadcrumbName: translate.formatMessage(message.order) },
                ];
                return [...result];
            });
        }
    }, [additionRoute]);
    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                baseTable={
                    <BaseTable
                        className={'order-table'}
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    navigate(getPathView(customerPhone, record));
                                },
                            };
                        }}
                    />
                }
            />
        </PageWrapper>
    );
};
export default OrderListPage;
