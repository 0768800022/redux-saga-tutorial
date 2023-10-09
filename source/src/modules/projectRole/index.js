import ListPage from '@components/common/layout/ListPage';
import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Avatar } from 'antd';
import { generatePath, useNavigate } from 'react-router-dom';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { convertUtcToLocalTime } from '@utils';
import routes from './routes';
import classNames from 'classnames';

const message = defineMessages({
    home: 'Trang chủ',
    projectRole: 'Vai trò dự án',
    objectName: 'Vai trò dự án',
    createdDate: 'Ngày tạo',
    name: 'Tên vai trò dự án',
});

const ProjectRoleListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.projectRole,
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
        },
    });
    const breadRoutes = [
        { breadcrumbName: translate.formatMessage(message.home) },
        { breadcrumbName: translate.formatMessage(message.projectRole) },
    ];
    const searchFields = [
        {
            key: 'projectRoleName',
            placeholder: translate.formatMessage(message.name),
        },
    ];

    const columns = [
        {
            title: translate.formatMessage(message.name),
            dataIndex: 'projectRoleName',
        },
        // {
        //     title: translate.formatMessage(message.createdDate),
        //     dataIndex: 'createdDate',
        //     render: (createdDate) => {
        //         const modifiedDate = convertStringToDateTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT).add(
        //             7,
        //             'hour',
        //         );
        //         const modifiedDateTimeString = convertDateTimeToString(modifiedDate, DEFAULT_FORMAT);
        //         return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateTimeString}</div>;
        //     },
        //     width: 180,
        //     align: 'center',
        // },
        mixinFuncs.renderStatusColumn({ width: '80px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
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
export default ProjectRoleListPage;
