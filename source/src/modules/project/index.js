import ListPage from '@components/common/layout/ListPage';
import React, { useEffect, useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons';
import { Button, Avatar, Tag } from 'antd';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import routes from '@routes';
import route from '@modules/projectTask/routes';
import { BookOutlined, TeamOutlined, WomanOutlined } from '@ant-design/icons';
import { statusOptions, projectTaskState } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';

import useFetch from '@hooks/useFetch';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
const message = defineMessages({
    home: 'Trang chủ',
    project: 'Dự án',
    objectName: 'dự án',
    code: 'Mã dự án',
    id: 'Id',
    createdDate: 'Ngày tạo',
    avatar: 'Avatar',
    description: 'Mô tả',
    leader: 'Leader',
    name: 'Tên dự án',
    endDate: 'Ngày kết thúc',
    startDate: 'Ngày bắt đầu',
    state: 'Tình trạng',
    status: 'Trạng thái',
    developer: 'Lập trình viên',
    task: 'Task',
    member: 'Thành viên',
    group: 'Nhóm',
});

const ProjectListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const developerId = queryParameters.get('developerId');
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const leaderName = queryParameters.get('leaderName');
    const developerName = queryParameters.get('developerName');
    const [dataApply, setDataApply] = useState([]);
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.project,
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

                funcs.additionalActionColumnButtons = () => ({
                    task: ({ id, name, leaderInfo, status, state }) => (
                        <BaseTooltip title={translate.formatMessage(message.task)}>
                            <Button
                                type="link"
                                disabled={state === 1}
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const pathDefault = `?projectId=${id}&projectName=${name}&leaderId=${leaderInfo.id}`;
                                    let path;
                                    if (leaderName) {
                                        path =
                                            routes.leaderProjectTaskListPage.path +
                                            pathDefault +
                                            `&leaderName=${leaderName}`;
                                    } else if (developerName) {
                                        path =
                                            routes.developerProjectTaskListPage.path +
                                            pathDefault +
                                            `&developerName=${developerName}`;
                                    } else {
                                        if (status == 1) {
                                            path = route.ProjectTaskListPage.path + pathDefault + `&active=${true}`;
                                        }
                                        else
                                            path = route.ProjectTaskListPage.path + pathDefault;
                                    }
                                    navigate(path, { state: { pathPrev: location.search } });
                                }}
                            >
                                <BookOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    member: ({ id, name, status }) => (
                        <BaseTooltip title={translate.formatMessage(message.member)}>
                            <Button
                                type="link"
                                style={{ padding: '0' }}
                                // disabled={status === -1}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (status == 1) {
                                        navigate(routes.projectMemberListPage.path + `?projectId=${id}&projectName=${name}&active=${true}`);
                                    }
                                    else {
                                        navigate(routes.projectMemberListPage.path + `?projectId=${id}&projectName=${name}`);
                                    }
                                }
                                }
                            >
                                <WomanOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    team: ({ id, name, status }) => (
                        <BaseTooltip title={translate.formatMessage(message.group)}>
                            <Button
                                type="link"
                                style={{ padding: '0' }}
                                // disabled={status === -1}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (status === 1) {
                                        navigate(routes.teamListPage.path + `?projectId=${id}&projectName=${name}&active=${true}`);
                                    }
                                    else {
                                        navigate(routes.teamListPage.path + `?projectId=${id}&projectName=${name}`);
                                    }
                                }}
                            >
                                <TeamOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                });

                funcs.changeFilter = (filter) => {
                    const leaderId = queryParams.get('leaderId');
                    const leaderName = queryParams.get('leaderName');
                    const developerId = queryParams.get('developerId');
                    const developerName = queryParams.get('developerName');
                    if (leaderId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ leaderId: leaderId, leaderName: leaderName, ...filter }),
                        );
                    } else if (developerId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ developerId: developerId, developerName: developerName, ...filter }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(serializeParams(filter));
                    }
                };
            },
        });

    const { data: dataDeveloperProject, execute: executeGetList } = useFetch(apiConfig.developer.getProject, {
        immediate: true,
        pathParams: { id: developerId },
    });

    useEffect(() => {
        if (!developerId) {
            setDataApply(data);
        } else {
            setDataApply(dataDeveloperProject?.data?.content);
        }
    }, [data, dataDeveloperProject]);

    const setBreadRoutes = () => {
        const breadRoutes = [{ breadcrumbName: translate.formatMessage(message.home) }];
        if (leaderName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.leader),
                path: routes.leaderListPage.path,
            });
        } else if (developerName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.developer),
                path: routes.developerListPage.path,
            });
        }
        breadRoutes.push({ breadcrumbName: translate.formatMessage(message.project) });

        return breadRoutes;
    };
    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };

    const setSearchField = () => {
        let searchFields = [
            {
                key: 'name',
                placeholder: translate.formatMessage(message.name),
            },
            {
                key: 'state',
                placeholder: translate.formatMessage(message.state),
                type: FieldTypes.SELECT,
                options: stateValues,
            },
        ];
        !leaderName &&
            !developerName &&
            searchFields.splice(1, 0, {
                key: 'status',
                placeholder: translate.formatMessage(message.status),
                type: FieldTypes.SELECT,
                options: statusValues,
            });
        return searchFields;
    };

    const setColumns = () => {
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
                dataIndex: 'name',
            },
            {
                title: translate.formatMessage(message.leader),
                dataIndex: ['leaderInfo', 'leaderName'],
                width: 150,
            },
            {
                title: translate.formatMessage(message.startDate),
                dataIndex: 'startDate',
                render: (startDate) => {
                    return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate)}</div>;
                },
                width: 140,
                align: 'center',
            },
            {
                title: translate.formatMessage(message.endDate),
                dataIndex: 'endDate',
                render: (endDate) => {
                    return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate)}</div>;
                },
                width: 140,
                align: 'center',
            },
            {
                title: 'Tình trạng',
                dataIndex: 'state',
                align: 'center',
                width: 120,
                render(dataRow) {
                    const state = stateValues.find((item) => item.value == dataRow);
                    return (
                        <Tag color={state.color}>
                            <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                        </Tag>
                    );
                },
            },
        ];

        !leaderName && !developerName && columns.push(mixinFuncs.renderStatusColumn({ width: '120px' }));
        columns.push(
            mixinFuncs.renderActionColumn(
                {
                    team: true,
                    member: !leaderName && !developerName && true,
                    task: true,
                    edit: !leaderName && !developerName && true,
                    delete: !leaderName && !developerName && true,
                },
                { width: '200px' },
            ),
        );
        return columns;
    };
    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                title={<span style={{ fontWeight: 'normal' }}>{leaderName || developerName}</span>}
                searchForm={mixinFuncs.renderSearchForm({ fields: setSearchField(), initialValues: queryFilter })}
                actionBar={!leaderName && !developerName && mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={dataApply}
                        columns={setColumns()}
                    />
                }
            />
        </PageWrapper>
    );
};

export default ProjectListPage;
