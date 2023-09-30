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
import GroupFoodVariantForm from './GroupFoodVariantForm';

const messages = defineMessages({
    home: 'Home',
    serviceCategory: 'Service Category',
    service: 'Service',
    serviceVariant: 'Service Variant',
});

function GroupFoodVariantSavePage() {
    const { variantId, restaurantId, serviceCategoryId, id, serviceId } = useParams();
    const translate = useTranslate();
    // const { data: serviceOptions, execute: executeGetService } = useFetch(apiConfig.category.getList, {
    //     immediate: false,
    //     mappingData: (res) => {
    //         if (res.result)
    //             return res.data.content?.map((item) => ({
    //                 value: item.id,
    //                 label: item.name,
    //             }));
    //     },
    // });
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: apiConfig.groupFood,
        options: {
            getListUrl: generatePath(`${routes.groupFoodVariantListPage.path}?parentId=${serviceId}`, {
                restaurantId,
                serviceCategoryId,
                serviceId,
            }),
            objectName: translate.formatMessage(messages.serviceVariant),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => ({
                ...data,
                serviceCategoryId: serviceCategoryId,
                restaurantId,
                serviceId: id,
                seoName: data.seoName ? convertToUrlFriendly(data.seoName) : convertToUrlFriendly(data.name),
                prices: JSON.stringify({ price: data.price, saleOff: data.saleOff || 0 }),
            });
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    serviceCategoryId: serviceCategoryId,
                    restaurantId,
                    status: STATUS_ACTIVE,
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

    // useEffect(() => {
    //     executeGetService();
    // }, []);

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
                {
                    breadcrumbName: translate.formatMessage(messages.serviceVariant),
                    path: generatePath(`${routes.groupFoodVariantListPage.path}?parentId=${serviceId}`, {
                        restaurantId,
                        serviceCategoryId,
                        id: variantId,
                        serviceId,
                    }),
                },
                { breadcrumbName: title },
            ]}
        >
            <GroupFoodVariantForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                // serviceOptions={serviceOptions || []}
                // executeGetService={executeGetService}
            />
        </PageWrapper>
    );
}

export default GroupFoodVariantSavePage;
