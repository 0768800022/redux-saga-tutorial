import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React, { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import GroupFoodForm from './GroupFoodForm';
import routes from '@routes';
import { STATUS_ACTIVE } from '@constants';
import useFetch from '@hooks/useFetch';
import { KIND_SERVICE_NORMAL } from '@constants/masterData';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { convertToUrlFriendly } from '@store/utils';

const messages = defineMessages({
    home: 'Home',
    serviceCategory: 'Service Category',
    service: 'Service',
});

const GroupFoodSavePage = () => {
    const { id, restaurantId, serviceCategoryId } = useParams();
    const translate = useTranslate();
    const { data: serviceOptions, execute: executeGetService } = useFetch(apiConfig.category.getList, {
        immediate: false,
        mappingData: (res) => {
            if (res.result)
                return res.data.content?.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
        },
    });

    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: apiConfig.groupFood,
        options: {
            getListUrl: generatePath(routes.groupFoodListPage.path, { restaurantId, serviceCategoryId }),
            objectName: translate.formatMessage(messages.service),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => ({
                ...data,
                serviceCategoryId: serviceCategoryId,
                restaurantId,
                serviceId: id,
                // plu:null,
                // kind: KIND_SERVICE_NORMAL,
                seoName: data.seoName ? convertToUrlFriendly(data.seoName) : convertToUrlFriendly(data.name),
                prices: JSON.stringify({ price: data.price, saleOff: data.saleOff || 0 }),
            });
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    serviceCategoryId: serviceCategoryId,
                    restaurantId,
                    status: STATUS_ACTIVE,
                    // kind: KIND_SERVICE_NORMAL,
                    // plu:null,
                    seoName: data.seoName ? convertToUrlFriendly(data.seoName) : convertToUrlFriendly(data.name),
                    prices: JSON.stringify({ price: data.price, saleOff: data.saleOff || 0 }),
                };
            };

            funcs.mappingData = (data) => {
                return {
                    ...data.data,
                    ...JSON.parse(data.data.prices),
                };
            };
        },
    });

    useEffect(() => {
        executeGetService();
    }, []);

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                {
                    breadcrumbName: translate.formatMessage(messages.serviceCategory),
                    path: generatePath(routes.categoryListPage.path, { restaurantId }),
                },
                {
                    breadcrumbName: translate.formatMessage(messages.service),
                    path: generatePath(routes.groupFoodListPage.path, { restaurantId, serviceCategoryId }),
                },
                { breadcrumbName: title },
            ]}
        >
            <GroupFoodForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                serviceOptions={serviceOptions || []}
                executeGetService={executeGetService}
            />
        </PageWrapper>
    );
};

export default GroupFoodSavePage;
