import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useParams } from 'react-router-dom';

const message = defineMessages({
    objectName: 'code',
    code: 'Code',
    home: 'Home',
    promotion: 'Promotion',
    promotionListCode: 'Promotion List Code',
});

function PromotionListCode() {
    const translate = useTranslate();
    const { id, restaurantId } = useParams();
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            getList: apiConfig.promotion.listPromotionCode,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);

                mixinFuncs.handleFetchList({ ...params, promotionId: id });
            };
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
        { title: translate.formatMessage(message.code), dataIndex: 'code' },
        mixinFuncs.renderStatusColumn({ width: '90px' }),
    ];

    const searchFields = [
        {
            key: 'code',
            placeholder: translate.formatMessage(message.code),
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                {
                    breadcrumbName: translate.formatMessage(message.promotion),
                    path: generatePath(routes.promotionListPage.path, { restaurantId }),
                },
                { breadcrumbName: translate.formatMessage(message.promotionListCode) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
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

export default PromotionListCode;
