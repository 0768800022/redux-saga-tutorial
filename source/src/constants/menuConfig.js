import { ControlOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import routes from '@routes';
import { IconCategory2 } from '@tabler/icons-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import apiConfig from './apiConfig';
import { categoryKind } from './masterData';

const navMenuConfig = [
    {
        label: 'Category Management',
        key: 'category-management',
        icon: <IconCategory2 size={16} />,
        // permission: apiConfig.category.getList.baseURL,
        children: [
            {
                label: categoryKind.service.title,
                key: 'department-category',
                path: generatePath(routes.categoryListPage.path, {
                    kind: categoryKind.service.value,
                }),
            },
        ],
    },
];

export default navMenuConfig;
