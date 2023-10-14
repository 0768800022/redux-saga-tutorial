import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { Avatar, Button, Tag } from 'antd';
import { UserOutlined, ContainerOutlined, ProjectOutlined } from '@ant-design/icons';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import { useNavigate, generatePath, useLocation } from 'react-router-dom';
import routes from '@routes';
import AvatarField from '@components/common/form/AvatarField';

const message = defineMessages({
    objectName: 'Nhóm',
    name: 'Họ và tên',
    home: 'Trang chủ',
    team: 'Nhóm',
    status: 'Trạng thái',
    course: 'Khoá học',
    project: 'Dự án',
    description: "Mô tả",
    leaderId: "Người hướng dẫn",
    projectId: "Dự án",
    teamName: "Tên nhóm",
});

const TeamListPage = () => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
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
                return `${pagePath}/create?projectId=${projectId}&projectName=${projectName}&active=${active}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?projectId=${projectId}&projectName=${projectName}`;
            };
        },
    });
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
            },

            {
                title: <FormattedMessage defaultMessage="Người hướng dẫn" />,
                dataIndex: ['leaderInfo', 'leaderName'],
                width: '150px',
            },
            {
                title: <FormattedMessage defaultMessage="Dự án" />,
                dataIndex: ['projectInfo', 'name'],
                width: '200px',
            },
            mixinFuncs.renderStatusColumn({ width: '120px' }),
        ];
        active && columns.push(
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
            placeholder: translate.formatMessage(message.teamName),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(message.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                {
                    breadcrumbName: translate.formatMessage(message.project),
                    path: generatePath(routes.projectListPage.path),
                },
                { breadcrumbName: translate.formatMessage(message.team) },
            ]}
        >
            <ListPage
                title={<span style={{ fontWeight: 'normal', fontSize: '18px' }}>{projectName}</span>}
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
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
        </PageWrapper>
    );
};
export default TeamListPage;
