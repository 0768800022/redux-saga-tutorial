import ListPage from '@components/common/layout/ListPage';
import React, { useEffect, useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants';
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
import { BookOutlined, TeamOutlined } from '@ant-design/icons';
import { statusOptions, projectTaskState } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';

import useFetch from '@hooks/useFetch';
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
    status: 'Trạng thái',
    developer: 'Lập trình viên',
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
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.project,
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

            funcs.additionalActionColumnButtons = () => ({
                task: ({ id, name, leaderInfo, status }) => (
                    <Button
                        type="link"
                        style={
                            status === 0 || status === -1
                                ? { padding: 0, opacity: 0.5, cursor: 'not-allowed' }
                                : { padding: 0 }
                        }
                        onClick={(e) => {
                            e.stopPropagation();
                            status !== 0 &&
                                status !== -1 &&
                                navigate(
                                    route.ProjectTaskListPage.path +
                                        `?projectId=${id}&projectName=${name}&leaderId=${leaderInfo.id}`,
                                );
                        }}
                    >
                        <BookOutlined />
                    </Button>
                ),
                member: ({ id, name }) => (
                    <Button
                        type="link"
                        style={
                            status === 0 || status === -1
                                ? { padding: 0, opacity: 0.5, cursor: 'not-allowed' }
                                : { padding: 0 }
                        }
                        onClick={(e) => {
                            e.stopPropagation();
                            status !== 0 &&
                                status !== -1 &&
                                navigate(routes.projectMemberListPage.path + `?projectId=${id}&projectName=${name}`);
                        }}
                    >
                        <TeamOutlined />
                    </Button>
                ),
            });
        },
    });

    const { data: dataListTask, execute: executeGetList } = useFetch(apiConfig.projectTask.getList, {
        immediate: true,
        params: { developerId: developerId },
        mappingData: ({ data }) => data.content.map((item) => ({ projectId: item?.project.id })),
    });
    useEffect(() => {
        let filteredList = [];
        if (data?.length > 0 && developerId) {
            if (dataListTask?.length > 0) {
                filteredList = data.filter((item1) => dataListTask.some((item2) => item2.projectId === item1.id));
            }
            setDataApply(filteredList);
        }
    }, [dataListTask]);

    useEffect(() => {
        if (!developerId) {
            setDataApply(data);
        }
    }, [data]);

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
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
        return convertDateTimeToString(dateConvert, DEFAULT_FORMAT);
    };

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(message.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];

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
            width: 200,
            align: 'center',
        },
        {
            title: translate.formatMessage(message.endDate),
            dataIndex: 'endDate',
            render: (endDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate)}</div>;
            },
            width: 200,
            align: 'center',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return <Tag color={state.color}>{state.label}</Tag>;
            },
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            {
                member: true,
                task: true,
                edit: !leaderName && !developerName && true,
                delete: !leaderName && !developerName && true,
            },
            { width: '150px' },
        ),
    ];

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                title={<span style={{ fontWeight: 'normal' }}>{leaderName || developerName}</span>}
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={!leaderName && !developerName && mixinFuncs.renderActionBar()}
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
