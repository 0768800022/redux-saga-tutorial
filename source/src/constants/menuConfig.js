import routes from '@routes';
import { IconCategory2, IconRegistered } from '@tabler/icons-react';
import React from 'react';
import { generatePath } from 'react-router-dom';
import { categoryKind } from './masterData';

const navMenuConfig = [
    {
        label: 'Quản lý hệ thống',
        key: 'quan-ly-he-thong',
        icon: <IconCategory2 size={16} />,
        // permission: apiConfig.category.getList.baseURL,
        children: [
            {
                label: 'Danh mục',
                key: 'danh-muc',
                path: generatePath(routes.categoryListPage.path, {
                    kind: categoryKind.service.value,
                }),
            },
        ],
    },
    {
        label: 'Quản lý môn học',
        key: 'quan-ly-mon-hoc',
        icon: <IconCategory2 size={16} />,
        // permission: apiConfig.category.getList.baseURL,
        children: [
            {
                label: 'Môn học',
                key: 'mon-hoc',
                path: generatePath(routes.subjectListPage.path, {}),
            },
            {
                label: 'Khoá học',
                key: 'khoa-hoc',
                path: generatePath(routes.courseListPage.path, {}),
            },
        ],
    },
    {
        label: 'Quản lý tài khoản',
        key: 'account-management',
        icon: <IconCategory2 size={16} />,
        children: [
            {
                label: 'Quản lý sinh viên',
                key: 'student-management',
                // path: routes.studentListPage.path,
            },
        ],
    },
];

export default navMenuConfig;
