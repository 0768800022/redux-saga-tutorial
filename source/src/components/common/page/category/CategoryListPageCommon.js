import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useListBase from '@hooks/useListBase';
import { Avatar, Tag } from 'antd';
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import { statusOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { FieldTypes } from '@constants/formConfig';

function CategoryListPageCommon({
    breadcrumb,
    kind,
    apiConfig,
    dataIndexes = {
        image: 'categoryImage',
        name: 'categoryName',
    },
}) {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, [ 'label' ]);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: 'category',
        },
        override: (funcs) => {
            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                return {
                    ...prepareGetListParams(params),
                    kind,
                };
            };
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: dataIndexes.image,
            align: 'center',
            width: 100,
            render: (avatar) => (
                <Avatar
                    size="large"
                    shape="square"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        { title: 'Name', dataIndex: dataIndexes.name },
        {
            title: 'Status',
            dataIndex: 'status',
            align: 'center',
            width: 100,
            render(dataRow) {
                const status = statusValues.find((item) => item.value == dataRow);

                return <Tag color={status?.color}>{status.label}</Tag>;
            },
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '150px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: 'Name',
        },
        {
            key: 'status',
            placeholder: 'Status',
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];

    return (
        <PageWrapper routes={[ { breadcrumbName: 'Home' }, ...breadcrumb ]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
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
            />
        </PageWrapper>
    );
}

export default CategoryListPageCommon;
