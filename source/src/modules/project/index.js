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
import routes from './routes';
import route from '@modules/projectTask/routes';
import classNames from 'classnames';
import styles from './project.module.scss';
import { BookOutlined } from '@ant-design/icons';
import { statusOptions } from '@constants/masterData';

import useFetch from '@hooks/useFetch';
const message = defineMessages({
    home: 'Trang chủ',
    project: 'Dự án',
    objectName: 'dự án',
    code: 'Mã dự án',
    id: 'Id',
    createdDate: 'Ngày tạo',
    avatar: 'Avater',
    description: 'Mô tả',
    leader: 'Leader',
    name: 'Tên dự án',
    endDate: 'Ngày kết thúc',
    startDate: 'Ngày bắt đầu',
    status: 'Trạng thái',
});

const ProjectListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const developerId = queryParameters.get('developerId');
    const [dataFilter, setDataFilter] = useState();
    const [dataApply, setDataApply] = useState();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data: dataListTask } = useFetch(apiConfig.projectTask.getList, {
        immediate: true,
        params: { developerId: developerId },
    });
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
                task: ({ id, name, leaderInfo, state }) => (
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                                route.ProjectTaskListPage.path +
                                    `?projectId=${id}&projectName=${name}&leaderId=${leaderInfo.id}`,
                            );
                        }}
                    >
                        <BookOutlined />
                    </Button>
                ),
            });
        },
    });

    useEffect(() => {
        const listTask = dataListTask?.data?.content;
        let filteredList = [];
        if (data?.length > 0) {
            if (listTask?.length > 0) {
                data = data.filter((item1) => listTask.some((item2) => item2.project.id === item1.id));
            }
            setDataFilter(filteredList);
        }
    }, [dataListTask, data]);

    const breadRoutes = [
        { breadcrumbName: translate.formatMessage(message.home) },
        { breadcrumbName: translate.formatMessage(message.project) },
    ];
    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
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
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(startDate, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            width: 130,
            align: 'center',
        },
        {
            title: translate.formatMessage(message.endDate),
            dataIndex: 'endDate',
            render: (endDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(endDate, 'DD/MM/YYYY HH:MM:SS').format('DD/MM/YYYY')}
                    </div>
                );
            },
            width: 130,
            align: 'center',
        },
        {
            title: translate.formatMessage(message.status),
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const status = statusValues.find((item) => item.value == dataRow);
                return <Tag color={status.color}>{status.label}</Tag>;
            },
        },
        mixinFuncs.renderActionColumn({ task: true, edit: true, delete: true }, { width: '130px' }),
    ];
    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
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

export default ProjectListPage;
