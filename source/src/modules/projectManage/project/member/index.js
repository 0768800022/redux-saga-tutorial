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
import route from '@modules/projectManage/project/routes';
import routes from '@routes';
import { EditOutlined } from '@ant-design/icons';
import ScheduleFile from '@components/common/elements/ScheduleFile';
import { commonMessage } from '@locales/intl';
import styles from './member.module.scss';
import { FieldTypes } from '@constants/formConfig';

const message = defineMessages({
    objectName: 'Thành viên',
    role: 'Vai trò',
    name: 'Họ và tên ',
    developer: 'Lập trình viên',
    member: 'Thành viên',
    team: 'Nhóm',
});

const ProjectMemberListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const location = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    localStorage.setItem('pathPrev', location.search);
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.memberProject,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                const pathDefault = `?projectId=${projectId}&projectName=${projectName}`;
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
                    return `${pagePath}/create?projectId=${projectId}&projectName=${projectName}&active=${active}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    if (active) return `${pagePath}/${dataRow.id}` + pathDefault + `&active=${active}`;
                    else return `${pagePath}/${dataRow.id}` + pathDefault;
                };
                funcs.changeFilter = (filter) => {
                    const projectId = queryParams.get('projectId');
                    const projectName = queryParams.get('projectName');
                    const active = queryParams.get('active');
                    mixinFuncs.setQueryParams(
                        serializeParams({ projectId: projectId, projectName: projectName, active, ...filter }),
                    );
                };
            },
        });

    const setBreadRoutes = () => {
        const breadRoutes = [];

        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.project),
            path: route.projectListPage.path,
        });
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.member) });

        return breadRoutes;
    };
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(
            routes.memberActivityProjectListPage.path +
                `?projectId=${record?.project?.id}&studentId=${record?.developer.studentInfo?.id}&studentName=${record?.developer.studentInfo?.fullName}`,
        );
    };

    const columns = [
        {
            title: '#',
            dataIndex: ['developer', 'studentInfo', 'avatar'],
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
            title: translate.formatMessage(commonMessage.name),
            dataIndex: ['developer', 'studentInfo', 'fullName'],
            render: (fullName, record) => (
                <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                    {fullName}
                </div>
            ),
        },
        {
            title: translate.formatMessage(message.team),
            dataIndex: ['team', 'teamName'],
            width: 150,
        },
        {
            title: translate.formatMessage(commonMessage.role),
            dataIndex: ['projectRole', 'projectRoleName'],
            width: 150,
        },

        {
            title: 'Lịch trình',
            dataIndex: 'schedule',
            align: 'center',
            render: (schedule) => {
                return <ScheduleFile schedule={schedule} />;
            },
            width: 180,
        },

        // !leaderName && !developerName && columns.push(mixinFuncs.renderStatusColumn({ width: '120px' }));
        active &&
            mixinFuncs.renderActionColumn(
                {
                    edit: true,
                    delete: true,
                },
                { width: '150px' },
            ),
    ].filter(Boolean);
    const { data: teamData } = useFetch(apiConfig.team.autocomplete, {
        immediate: true,
        params: { projectId },
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.teamName })),
    });
    const searchFields = [
        {
            key: 'teamId',
            placeholder: translate.formatMessage(commonMessage.team),
            type: FieldTypes.SELECT,
            options: teamData,
        },
    ];

    // !leaderName && !developerName && columns.push(mixinFuncs.renderStatusColumn({ width: '120px' }));

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                title={<span style={{ fontWeight: 'normal' }}>{projectName}</span>}
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
                    className: styles.search,
                })}
                actionBar={active && mixinFuncs.renderActionBar()}
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
