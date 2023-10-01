import routes from '@routes';
import { IconCategory2 } from '@tabler/icons-react';
import React from 'react';
import { generatePath } from 'react-router-dom';
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
