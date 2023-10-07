import routes from '@routes';
import { IconCategory2, IconUserBolt, IconSchool } from '@tabler/icons-react';
import React from 'react';
import { generatePath } from 'react-router-dom';
import { categoryKind } from './masterData';
import { FormattedMessage } from 'react-intl';

const navMenuConfig = [
    {
        label: <FormattedMessage  defaultMessage='Quản lý tài khoản'/>,
        key: 'account-management',
        icon: <IconUserBolt size={16} />,
        children: [
            {
                label: <FormattedMessage  defaultMessage='Quản lý sinh viên'/>,
                key: 'student-management',
                path: routes.studentListPage.path,
            },
            {
                label: <FormattedMessage  defaultMessage='Quản lý leader'/>,
                key: 'leader-management',
                path: generatePath(routes.leaderListPage.path, {}),
            },
            {
                label: <FormattedMessage  defaultMessage='Quản lý lập trình viên'/>,
                key: 'developer-management',
                path: generatePath(routes.developerListPage.path, {}),
            },
            {
                label: <FormattedMessage  defaultMessage='Quản lý công ty'/>,
                key: 'company-management',
                path: generatePath(routes.companyListPage.path, {}),
            },
        ],
    },
    {
        label: <FormattedMessage  defaultMessage='Quản lý môn học'/>,
        key: 'quan-ly-mon-hoc',
        icon: <IconSchool size={16} />,
        // permission: apiConfig.category.getList.baseURL,
        children: [
            {
                label: <FormattedMessage  defaultMessage='Khoá học'/>,
                key: 'khoa-hoc',
                path: generatePath(routes.courseListPage.path, {}),
            },
            {
                label: <FormattedMessage  defaultMessage='Môn học'/>,
                key: 'mon-hoc',
                path: generatePath(routes.subjectListPage.path, {}),
            },
        ],
    },
    {
        label: <FormattedMessage  defaultMessage='Quản lý dự án'/>,
        key: 'quan-ly-du-an',
        icon: <IconUserBolt size={16} />,
        children: [
            {
                label: <FormattedMessage  defaultMessage='Quản lý dự án'/>,
                key: 'project-management',
                path: generatePath(routes.projectListPage.path, {}),
            },
            {
                label: <FormattedMessage  defaultMessage='Quản lý vai trò dự án'/>,
                key: 'project-role-management',
                path: generatePath(routes.projectRoleListPage.path, {}),
            },
        ],
    },
    {
        label: <FormattedMessage  defaultMessage='Quản lý hệ thống'/>,
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
            {
                label: categoryKind.major.title,
                key: 'major-category',
                path: generatePath(routes.categoryListPageMajor.path, {
                    kind: categoryKind.major.value,
                }),
            },
        ],
    },
];

export default navMenuConfig;
