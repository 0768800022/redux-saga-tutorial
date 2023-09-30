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
import { generatePath, useParams } from 'react-router-dom';
import routes from './routes';
import { GoodsKinds } from '@constants/masterData';
import { formatMoney, getPriceDeliver, getPricePickup, getPriceQrCode } from '@utils';
import { useSelector } from 'react-redux';
import { selectRestaurantList } from '@selectors/app';
import useFetch from '@hooks/useFetch';

const FoodListPage = () => {
    const { restaurantId, groupFoodId } = useParams();
    const restaurantDetail = useSelector(selectRestaurantList).find((item) => item.id == restaurantId);
    const { data: groupFoodDetail } = useFetch(apiConfig.groupFood.getById, {
        immediate: true,
        pathParams: { id: groupFoodId },
        mappingData: (res) => res.data,
    });
    const { data, mixinFuncs, queryFilter, loading, pagination, setLoading, changePagination } = useListBase({
        apiConfig: apiConfig.food,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: 'Food',
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content.map((item) => ({ ...item, id: item.rank, _id: item.id })),
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getItemDetailLink = (dataRow) => {
                return generatePath(routes.groupFoodSavePage.path, { restaurantId, id: dataRow._id });
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
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params, groupFoodId, restaurantId });
            };
        },
    });

    const { sortedData, onDragEnd, sortColumn } = useDrapDropTableItem({
        data,
        apiConfig: apiConfig.groupFood.update,
        setTableLoading: setLoading,
        indexField: 'rank',
    });

    const columns = [
        sortColumn,
        {
            title: 'Image',
            dataIndex: 'imagePath',
            render: (value) => <ImageCol path={value ? `${AppConstants.contentRootUrl}${value}` : null} />,
            width: '86px',
        },
        { title: 'Plu', dataIndex: 'plu', align: 'center', width: '100px' },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'In Price',
            dataIndex: 'price',
            align: 'center',
            render: (value, dataRow) =>
                dataRow.kind === GoodsKinds.COMMON ? formatMoney(getPriceQrCode(value).in_price, restaurantDetail) : '',
        },
        {
            title: 'Out Price',
            dataIndex: 'price',
            align: 'center',
            render: (value, dataRow) =>
                dataRow.kind === GoodsKinds.COMMON
                    ? formatMoney(getPriceQrCode(value).out_price, restaurantDetail)
                    : '',
        },
        {
            title: 'Pickup Price',
            dataIndex: 'price',
            align: 'center',
            render: (value, dataRow) =>
                dataRow.kind === GoodsKinds.COMMON ? formatMoney(getPricePickup(value).price, restaurantDetail) : '',
        },
        {
            title: 'Deliver Price',
            dataIndex: 'price',
            align: 'center',
            render: (value, dataRow) =>
                dataRow.kind === GoodsKinds.COMMON ? formatMoney(getPriceDeliver(value).price, restaurantDetail) : '',
        },
        mixinFuncs.renderActionColumn({ edit: true, deleteItem: true }, { width: '90px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: 'Name',
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: 'Home' },
                { breadcrumbName: 'Group Food', path: generatePath(routes.groupFoodListPage.path, { restaurantId }) },
                { breadcrumbName: groupFoodDetail?.name },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <DragDropTableV2
                        onDragEnd={onDragEnd}
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={sortedData}
                        columns={columns}
                    />
                }
            />
        </PageWrapper>
    );
};

export default FoodListPage;
