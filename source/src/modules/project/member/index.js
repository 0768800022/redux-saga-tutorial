import ListPage from '@components/common/layout/ListPage';
import React, { useEffect, useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    DATE_DISPLAY_FORMAT,
    DATE_FORMAT_DISPLAY,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
    AppConstants,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Avatar, Tag } from 'antd';
import { generatePath, useNavigate } from 'react-router-dom';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { convertUtcToLocalTime } from '@utils';
import { useLocation } from 'react-router-dom';
import useFetch from '@hooks/useFetch';
import route from '@modules/project/routes';
const message = defineMessages({
    home: 'Trang chủ',
    project: 'Dự án',
    objectName: 'Thành viên dự án',
    role: 'Vai trò',
    name: 'Họ và tên ',
    developer: 'Lập trình viên',
    member: 'Thành viên',
});

const ProjectMemberListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.memberProject,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
            funcs.getCreateLink = () => {
                return `${pagePath}/create?projectId=${projectId}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?projectId=${projectId}`;
            };
        },
    });

    const setBreadRoutes = () => {
        const breadRoutes = [{ breadcrumbName: translate.formatMessage(message.home) }];

        breadRoutes.push({
            breadcrumbName: translate.formatMessage(message.project),
            path: route.projectListPage.path,
        });
        breadRoutes.push({ breadcrumbName: translate.formatMessage(message.member) });

        return breadRoutes;
    };

    // const searchFields = [
    //     {
    //         key: 'name',
    //         placeholder: translate.formatMessage(message.name),
    //     },
    // ];

    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 80,
            render: (avatar) => (
                <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(message.name),
            dataIndex: ['developer', 'studentInfo', 'fullName'],
        },
        {
            title: translate.formatMessage(message.role),
            dataIndex: ['projectRole', 'projectRoleName'],
            width: 150,
        },

        {
            title: 'Lịch trình',
            dataIndex: 'schedule',
            render: (schedule) => {
                let check = JSON.parse(schedule);
                const newCheck = [
                    { key: 'M', value: check.t2 },
                    { key: 'T', value: check.t3 },
                    { key: 'W', value: check.t4 },
                    { key: 'T', value: check.t5 },
                    { key: 'F', value: check.t6 },
                    { key: 'S', value: check.t7 },
                    { key: 'S', value: check.cn },
                ];

                let dateString = '';
                newCheck.map((item) => {
                    if (item.value !== undefined) {
                        dateString += item.key + ' ';
                    }
                });

                return <div>{dateString}</div>;
            },
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '130px' }),
    ];

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                title={<span style={{ fontWeight: 'normal' }}>{projectName}</span>}
                // searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
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
};

export default ProjectMemberListPage;
