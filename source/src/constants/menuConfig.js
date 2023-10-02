import routes from '@routes';
import { IconCategory2 } from '@tabler/icons-react';
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
                label: categoryKind.education.title,
                key: 'education-category',
                path: generatePath(routes.categoryListPageEdu.path, {
                    kind: categoryKind.education.value,
                }),
            },
            {
                label: categoryKind.generation.title,
                key: 'generation-category',
                path: generatePath(routes.categoryListPageGen.path, {
                    kind: categoryKind.generation.value,
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
                path: generatePath(routes.subjectListPage.path, {

                }),
            },
            {
                label: 'Khoá học',
                key: 'khoa-hoc',
                path: generatePath(routes.courseListPage.path, {

                }),
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
