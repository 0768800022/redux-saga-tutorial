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
import routes from '@routes';
import { EditOutlined } from '@ant-design/icons';
import ScheduleFile from '@components/common/elements/ScheduleFile';

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
    const active = queryParameters.get('active');
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
            // funcs.additionalActionColumnButtons = () => ({
            //     edit: ({ id, name, project, status, state }) => (
            //         <Button
            //             disabled={project.status === 0 || project.status === -1}
            //             onClick={(e) => {
            //                 // e.stopPropagation();
            //                 navigate(routes.projectMemberSavePage.path);
            //             }}
            //             type="link"
            //             style={{ padding: 0 }}
            //         >
            //             <EditOutlined color="red" />
            //         </Button>
            //     ),
            // });
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

    const setColumns = () => {
        const columns = [
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
                align: 'center',
                render: (schedule) => {
                    return <ScheduleFile schedule={schedule} />;
                },
                width: 180,
            },
        ];

        // !leaderName && !developerName && columns.push(mixinFuncs.renderStatusColumn({ width: '120px' }));
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

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                title={<span style={{ fontWeight: 'normal' }}>{projectName}</span>}
                actionBar={active && mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={setColumns()}
                    />
                }
            />
        </PageWrapper>
    );
};

export default ProjectMemberListPage;
