import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React, { useEffect, useState } from 'react';
import { Avatar, Button, Tag, notification } from 'antd';
import { UserOutlined, ContainerOutlined, ProjectOutlined } from '@ant-design/icons';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import { useNavigate, generatePath, useLocation } from 'react-router-dom';
import routes from '@routes';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import styles from '../project.module.scss';
import useFetch from '@hooks/useFetch';

const message = defineMessages({
    objectName: 'Nhóm',
});

const TeamListPage = ({ setSearchFilter }) => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const activeProjectTab = localStorage.getItem('activeProjectTab');
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFilter, queryParams, serializeParams } = useListBase({
        apiConfig: apiConfig.team,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getCreateLink = () => {
                return `${routes.teamListPage.path}/create?projectId=${projectId}&projectName=${projectName}&active=${active}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                const pathDefault = `?projectId=${projectId}&projectName=${projectName}`;
                if (active) return `${routes.teamListPage.path}/${dataRow.id}` + pathDefault + `&active=${active}`;
                else return `${routes.teamListPage.path}/${dataRow.id}` + pathDefault;
            };
            funcs.changeFilter = (filter) => {
                const projectId = queryParams.get('projectId');
                const projectName = queryParams.get('projectName');
                const active = queryParams.get('active');
                mixinFuncs.setQueryParams(
                    serializeParams({ projectId: projectId, projectName: projectName, active: active, ...filter }),
                );
            };
        },
    });

    useEffect(() => {
        setSearchFilter(queryFilter);
    }, [queryFilter]);
    const setColumns = () => {
        const columns = [
            {
                title: '#',
                dataIndex: 'avatar',
                align: 'center',
                width: 80,
                render: (avatar) => (
                    <AvatarField
                        size="large"
                        icon={<UserOutlined />}
                        src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                    />
                ),
            },
            {
                title: <FormattedMessage defaultMessage="Tên nhóm" />,
                dataIndex: 'teamName',
                width: 150,
            },
            {
                title: <FormattedMessage defaultMessage="Dự án" />,
                dataIndex: ['projectInfo', 'name'],
                width: 170,
            },
            {
                title: <FormattedMessage defaultMessage="Người hướng dẫn" />,
                dataIndex: ['leaderInfo', 'leaderName'],
                width: 170,
            },
            mixinFuncs.renderStatusColumn({ width: '120px' }),
        ];
        active &&
            columns.push(
                mixinFuncs.renderActionColumn(
                    {
                        edit: true,
                        delete: true,
                    },
                    { width: '150px' },
                ),
            );
        return columns;
    };

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.teamName),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];

    const { execute: executeUpdateLeader } = useFetch(apiConfig.memberProject.autocomplete, { immediate: false });

    useEffect(() => {
        executeUpdateLeader({
            params: {
                projectId,
            },
            onError: () =>
                notification({
                    type: 'error',
                    title: 'Error',
                }),
        });
    }, [projectId]);

    const clearSearchFunc = (functionClear) => {
        functionClear();
    };

    return (
        <ListPage
            searchForm={mixinFuncs.renderSearchForm({
                fields: searchFields,
                className: styles.search,
                activeTab: activeProjectTab,
            })}
            actionBar={active && mixinFuncs.renderActionBar()}
            baseTable={
                <BaseTable
                    onChange={mixinFuncs.changePagination}
                    columns={setColumns()}
                    dataSource={data}
                    loading={loading}
                    pagination={pagination}
                />
            }
        ></ListPage>
    );
};
export default TeamListPage;
