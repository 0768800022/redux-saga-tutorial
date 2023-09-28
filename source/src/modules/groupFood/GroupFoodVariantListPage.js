import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import ImageCol from '@components/common/table/ImageCol';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useDrapDropTableItem from '@hooks/useDrapDropTableItem';
import { Button } from 'antd/es';
import { Link, generatePath, useParams } from 'react-router-dom';
import routes from '@routes';
import Currency from '@components/common/elements/Currency';
import { FieldTypes } from '@constants/formConfig';
import useTranslate from '@hooks/useTranslate';
import { statusOptions } from '@constants/masterData';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';

const messages = defineMessages({
    home: 'Home',
    serviceCategory: 'Service Category',
    service: 'Service',
    serviceName: 'Name',
    status: 'Status',
    price: 'Price',
    saleOff: 'Sale off',
    serviceVariant: 'Service Variant',
});
function GroupFoodVariantListPage() {
    const { restaurantId, serviceCategoryId, id, serviceId } = useParams();
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, setLoading, changePagination } = useListBase({
        apiConfig: apiConfig.groupFood,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(messages.service),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.content.map((item) => ({ ...item, id: item.id, _id: item.id })),
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
            funcs.getItemDetailLink = (dataRow) => {
                return generatePath(routes.groupFoodVariantSavePage.path, {
                    restaurantId,
                    serviceCategoryId,
                    serviceId,
                    id: dataRow._id,
                });
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params, categoryId: serviceCategoryId });
            };
            funcs.additionalActionColumnButtons = () => {
                return {
                    deleteItem: ({ buttonProps, ...dataRow }) => {
                        return (
                            <Button
                                {...buttonProps}
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(dataRow._id);
                                }}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined />
                            </Button>
                        );
                    },
                };
            };
        },
    });
    const columns = [
        {
            title: '#',
            dataIndex: 'imagePath',
            render: (value) => <ImageCol path={value ? `${AppConstants.contentRootUrl}${value}` : null} />,
            width: '86px',
        },
        {
            title: translate.formatMessage(messages.serviceName),
            dataIndex: 'name',
            render: (data, dataRow) => {
                return <span>{data}</span>;
            },
        },
        {
            title: translate.formatMessage(messages.price),
            dataIndex: 'prices',
            width: '200px',
            align: 'center',
            render: (data) => <Currency value={JSON.parse(data).price} />,
        },
        {
            title: translate.formatMessage(messages.saleOff),
            dataIndex: 'prices',
            width: '200px',
            align: 'center',
            render: (data,dataRow) => {
                return (
                    <span>
                        {data && JSON.parse(data).saleOff ? `${JSON.parse(data).saleOff} %` : ''}
                    </span>
                );
            },
        },
        mixinFuncs.renderStatusColumn({ width: '90px' }),
        mixinFuncs.renderActionColumn({ edit: true, deleteItem: true }, { width: '120px' }),
    ];
    const searchFields = [
        {
            key: 'serviceName',
            placeholder: translate.formatMessage(messages.serviceName),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(messages.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                {
                    breadcrumbName: translate.formatMessage(messages.serviceCategory),
                    path: generatePath(routes.categoryListPage.path, { restaurantId, serviceCategoryId }),
                },
                {
                    breadcrumbName: translate.formatMessage(messages.service),
                    path: generatePath(routes.groupFoodListPage.path, { restaurantId, serviceCategoryId }),
                },
                { breadcrumbName: translate.formatMessage(messages.serviceVariant) },
            ]}
        >
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
}

export default GroupFoodVariantListPage;
