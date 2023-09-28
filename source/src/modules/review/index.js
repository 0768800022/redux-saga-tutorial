import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { Avatar, Button, Rate } from 'antd';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { UserOutlined, EyeOutlined } from '@ant-design/icons';
import routes from './routes';

const message = defineMessages({
    objectName: 'review',
    home: 'Home',
    message: 'Message',
    star: 'Star',
    review: 'Review',
    storeName: 'Store Name',
    customerName: 'Customer Name',
});
function ReviewListPage() {
    const { restaurantId } = useParams();
    const translate = useTranslate();
    const navigate = useNavigate();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.review,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.content.map((item) => ({
                                ...item,
                                id: item.id,
                                customerName: item.customer.userName,
                                customerAvatar: item.customer.userAvatar,
                                // storeName: item.store.storeName,
                                // storeLogo: item.store.logoPath,
                            })),
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                return {
                    ...prepareGetListParams(params),
                    storeId: restaurantId,
                };
            };
            funcs.additionalActionColumnButtons = () => {
                return {
                    viewReview: ({ buttonProps, ...dataRow }) => {
                        return (
                            <Button
                                {...buttonProps}
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        generatePath(routes.reviewSavePage.path, {
                                            id: dataRow.id,
                                            restaurantId,
                                        }),
                                    );
                                }}
                                style={{ padding: 0 }}
                            >
                                <EyeOutlined />
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
            dataIndex: 'customerAvatar',
            align: 'center',
            width: 100,
            render: (logo) => (
                <Avatar
                    size="large"
                    shape="square"
                    icon={<UserOutlined />}
                    style={{ background: '#e4e4e4' }}
                    src={logo ? `${AppConstants.contentRootUrl}${logo}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(message.customerName),
            dataIndex: 'customerName',
        },
        {
            title: translate.formatMessage(message.message),
            dataIndex: 'message',
        },
        {
            title: translate.formatMessage(message.star),
            dataIndex: 'star',
            render: (data, dataRow) => <Rate value={data} disabled />,
            width: 200,
            align: 'center',
        },
        // mixinFuncs.renderActionColumn({ viewReview: true, edit: true, delete: true }, { width: '120px' }),
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.review) },
            ]}
        >
            <ListPage
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

export default ReviewListPage;
