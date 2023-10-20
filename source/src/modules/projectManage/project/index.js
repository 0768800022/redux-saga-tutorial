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
import { IconBrandTeams } from '@tabler/icons-react';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import routes from '@routes';
import route from  '@modules/projectManage/project/projectTask/routes';
import { BookOutlined, TeamOutlined, WomanOutlined } from '@ant-design/icons';
import { statusOptions, projectTaskState } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
// import icon_team_1 from '@assets/images/team-Members-Icon.png';
import { UserTypes, storageKeys } from '@constants';
import { getData } from '@utils/localStorage';

import useFetch from '@hooks/useFetch';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
const message = defineMessages({
    objectName: 'Dự án',
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
    const useKind = getData(storageKeys.USER_KIND);

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
                        <BaseTooltip title={translate.formatMessage(commonMessage.task)}>
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
                                        } else path = route.ProjectTaskListPage.path + pathDefault;
                                    }
                                    navigate(path, { state: { pathPrev: location.search } });
                                }}
                            >
                                <BookOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    member: ({ id, name, status }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.member)}>
                            <Button
                                type="link"
                                style={{ padding: '0' }}
                                // disabled={status === -1}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (status == 1) {
                                        navigate(
                                            routes.projectMemberListPage.path +
                                                `?projectId=${id}&projectName=${name}&active=${true}`,
                                        );
                                    } else {
                                        navigate(
                                            routes.projectMemberListPage.path + `?projectId=${id}&projectName=${name}`,
                                        );
                                    }
                                }}
                            >
                                <UserOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    team: ({ id, name, status }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.team)}>
                            <Button
                                type="link"
                                style={{ padding: '0' }}
                                // disabled={status === -1}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (status === 1) {
                                        navigate(
                                            routes.teamListPage.path +
                                                `?projectId=${id}&projectName=${name}&active=${true}`,
                                        );
                                    } else {
                                        navigate(routes.teamListPage.path + `?projectId=${id}&projectName=${name}`);
                                    }
                                }}
                            >
                                <IconBrandTeams color="#2e85ff" size={17} style={{ marginBottom: '-2px' }} />
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
        const breadRoutes = [];
        if (leaderName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.leader),
                path: routes.leaderListPage.path,
            });
        } else if (developerName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.developer),
                path: routes.developerListPage.path,
            });
        }
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.project) });

        return breadRoutes;
    };
    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.projectName),
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
        },
        useKind === UserTypes.MANAGER && {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ].filter(Boolean);

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
            title: translate.formatMessage(commonMessage.projectName),
            dataIndex: 'name',
        },
        {
            title: translate.formatMessage(commonMessage.leader),
            dataIndex: ['leaderInfo', 'leaderName'],
            width: 150,
        },
        {
            title: translate.formatMessage(commonMessage.startDate),
            dataIndex: 'startDate',
            render: (startDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate)}</div>;
            },
            width: 140,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
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
        !leaderName && !developerName && useKind === UserTypes.MANAGER && mixinFuncs.renderStatusColumn({ width: '120px' }),
        useKind !== UserTypes.STUDENT && mixinFuncs.renderActionColumn(
            {
                team: true,
                member: !leaderName && !developerName && true,
                task: true,
                edit: !leaderName && !developerName && true,
                delete: !leaderName && !developerName && true,
            },
            { width: '200px' },
        ),
    ].filter(Boolean);
    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                title={<span style={{ fontWeight: 'normal' }}>{leaderName || developerName}</span>}
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={!leaderName && !developerName  && mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={dataApply}
                        columns={columns}
                    />
                }
            />
        </PageWrapper>
    );
};

export default ProjectListPage;
