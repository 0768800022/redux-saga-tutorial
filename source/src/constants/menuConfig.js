import routes from '@routes';
import { createPathWithData } from '@utils';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import {
    UnorderedListOutlined,
    UserOutlined,
    RiseOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
    StarOutlined,
    LineChartOutlined,
} from '@ant-design/icons';
export const clientNav = (res) => {
    return [
        {
            label: <FormattedMessage defaultMessage="Dashboard" />,
            key: 'report',
            path: createPathWithData(routes.reportListPage.path, { restaurantId: res.id }),
            icon: <LineChartOutlined />,
        },
        {
            label: <FormattedMessage defaultMessage="Quản lý sản phẩm" />,
            key: 'menu',
            path: createPathWithData(routes.categoryListPage.path, {
                restaurantId: res.id,
            }),
            subPaths: [
                new RegExp(createPathWithData(routes.categoryListPage.path, { restaurantId: res.id }) + '/.+'),
                new RegExp(createPathWithData(routes.groupFoodListPage.path, { restaurantId: res.id }) + '/.+'),
                new RegExp(createPathWithData(routes.groupFoodListPage.path, { restaurantId: res.id }) + '/.+'),
            ],
            icon: <UnorderedListOutlined />,
        },
        {
            label: <FormattedMessage defaultMessage="Quản lý đơn đặt hàng" />,
            key: 'menu',
            path: createPathWithData(routes.orderListPage.path, {
                restaurantId: res.id,
            }),
            subPaths: [
                new RegExp(createPathWithData(routes.orderListPage.path, { restaurantId: res.id }) + '/.+'),
            ],
            icon: <ShoppingCartOutlined />,
        },
        {
            label: <FormattedMessage defaultMessage="Quản lý khách hàng" />,
            key: 'account',
            path: createPathWithData(routes.customerListPage.path, { restaurantId: res.id }),
            subPaths: [new RegExp(createPathWithData(routes.customerListPage.path, { restaurantId: res.id }) + '/.+')],
            icon: <UserOutlined />,
        },
        {
            label: <FormattedMessage defaultMessage="Khuyến mãi" />,
            key: 'promotion',
            path: createPathWithData(routes.promotionListPage.path, { restaurantId: res.id }),
            subPaths: [new RegExp(createPathWithData(routes.promotionListPage.path, { restaurantId: res.id }) + '/.+')],
            icon: <RiseOutlined />,
        },
        {
            label: <FormattedMessage defaultMessage="Danh sách đánh giá" />,
            key: 'review',
            path: createPathWithData(routes.reviewListPage.path, { restaurantId: res.id }),
            icon: <StarOutlined />,
        },
        {
            label: <FormattedMessage defaultMessage="Cài đặt" />,
            key: 'setting',
            path: createPathWithData(routes.settingPage.path, { restaurantId: res.id }),
            icon: <SettingOutlined />,
        },
    ];
};
