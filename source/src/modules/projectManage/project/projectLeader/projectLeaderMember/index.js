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
import styles from './projectLeaderMember.module.scss';
import { commonMessage } from '@locales/intl';
import { FieldTypes } from '@constants/formConfig';
import useListBaseProject from '@hooks/useListBaseProject';

const message = defineMessages({
    home: 'Trang chủ',
    project: 'Dự án',
    objectName: 'Thành viên dự án',
    role: 'Vai trò',
    name: 'Họ và tên ',
    developer: 'Lập trình viên',
    member: 'Thành viên',
    team: 'Nhóm',
});

const ProjectLeaderMemberListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const leaderId = queryParameters.get('leaderId');
    localStorage.setItem('pathPrev', location.search);
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBaseProject({
            apiConfig: apiConfig.memberProject,
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
                    if (active) {
                        return `${pagePath}/member/create?projectId=${projectId}&projectName=${projectName}&leaderId=${leaderId}&active=${active}`;
                    }
                    return `${pagePath}/member/create?projectId=${projectId}&projectName=${projectName}&leaderId=${leaderId}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    if (active) {
                        return `${pagePath}/member/${dataRow.id}?projectId=${projectId}&projectName=${projectName}&leaderId=${leaderId}&active=${active}`;
                    }
                    return `${pagePath}/member/${dataRow.id}?projectId=${projectId}&projectName=${projectName}&leaderId=${leaderId}`;
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
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(
            routes.memberActivityProjectLeaderListPage.path +
                `?projectId=${record?.project?.id}&studentId=${record?.developer.studentInfo?.id}&studentName=${record?.developer.studentInfo?.fullName}`,
        );
    };
    const columns = [
        {
            title: '#',
            dataIndex: ['developer', 'accountDto', 'avatar'],
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
            dataIndex: ['developer', 'accountDto', 'fullName'],
            // render: (fullName, record) => (
            //     <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
            //         {fullName}
            //     </div>
            // ),
        },
   
        {
            title: translate.formatMessage(message.role),
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

        active &&
            mixinFuncs.renderActionColumn(
                {
                    edit: true,
                    delete: true,
                },
                { width: '150px' },
            ),
    ].filter(Boolean);
  

    // !leaderName && !developerName && columns.push(mixinFuncs.renderStatusColumn({ width: '120px' }));
  
    return (
       
        <ListPage
            title={<span style={{ fontWeight: 'normal' }}>{projectName}</span>}
            actionBar={active && mixinFuncs.renderActionBar()}
            // searchForm={mixinFuncs.renderSearchForm({
            //     fields: searchFields,
            //     initialValues: queryFilter,
            //     className: styles.search,
            // })}
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
       
    );
};

export default ProjectLeaderMemberListPage;
