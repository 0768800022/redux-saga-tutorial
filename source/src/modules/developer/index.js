import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, TIME_FORMAT_DISPLAY } from '@constants';
import apiConfig from '@constants/apiConfig';
import { levelOptionSelect, statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { convertUtcToLocalTime } from '@utils';
import { Button, Tag } from 'antd';
import { ProjectOutlined } from '@ant-design/icons';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import FolderIcon from '@assets/icons';
import { FieldTypes } from '@constants/formConfig';

const message = defineMessages({
    objectName: 'Lập trình viên',
    home: 'Trang chủ',
    developer: 'Lập trình viên',
    status: 'Trạng thái',
    name: 'Họ và tên',
});

const DeveloperListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFiter, serializeParams } = useListBase({
        apiConfig: apiConfig.developer,
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
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(serializeParams(filter));
            };
            funcs.additionalActionColumnButtons = () => ({
                project: ({ id, studentInfo }) => (
                    <Button
                        type="link"
                        style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                                routes.developerProjectListPage.path +
                                `?developerId=${id}&developerName=${studentInfo?.fullName}`,
                            );
                        }}
                    >
                        <FolderIcon />
                    </Button>
                ),
            });
        },
    });
    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: ['studentInfo', 'fullName'],
        },
        {
            title: 'Vai trò',
            dataIndex: ['roleInfo', 'projectRoleName'],
            width: 170,
        },
        {
            title: 'Trình độ',
            dataIndex: 'level',
            width: 100,
            render: (level) => {
                const levelLabel = levelOptionSelect.map((item) => {
                    if (level === item.value) {
                        return item.label;
                    }
                });
                return <div>{levelLabel}</div>;
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            width: 170,
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        // {
        //     title: translate.formatMessage(message.status),
        //     dataIndex: 'status',
        //     align: 'center',
        //     width: 120,
        //     render(dataRow) {
        //         console.log(dataRow);
        //         const status = statusValues.find((item) => item.value == dataRow);
        //         return <Tag color={status.color}>{status.label}</Tag>;
        //     },
        // },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ project: true, edit: true, delete: true }, { width: 160 }),
    ];

    const searchFields = [
        {
            key: 'studentInfo',
            placeholder: translate.formatMessage(message.name),
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
                { breadcrumbName: translate.formatMessage(message.developer) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            ></ListPage>
        </PageWrapper>
    );
};

export default DeveloperListPage;
