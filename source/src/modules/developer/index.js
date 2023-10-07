import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, TIME_FORMAT_DISPLAY } from '@constants';
import apiConfig from '@constants/apiConfig';
import { levelOptionSelect } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { convertUtcToLocalTime } from '@utils';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
const message = defineMessages({
    objectName: 'Lập trình viên',
    home: 'Trang chủ',
    developer: 'Lập trình viên',
    status: 'Trạng thái',
    name: 'Họ và tên',
});

const DeveloperListPage = () => {
    const translate = useTranslate();
    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
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
        },
    });
    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: ['studentInfo', 'fullName'],
            width: '350px',
        },
        {
            title: 'Vai trò',
            dataIndex: ['roleInfo', 'projectRoleName'],
            width: '60px',
        },
        {
            title: 'Trình độ',
            dataIndex: 'level',
            width: '20px',
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
            width: '20px',
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '60px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
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
