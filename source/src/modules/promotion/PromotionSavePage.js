import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import { convertIsoToUtc, convertUtcToIso } from '@utils';
import React from 'react';
import PromotionForm from './PromotionForm';
import routes from './routes';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { generatePath, useParams } from 'react-router-dom';
import { STATE_PROMOTION_CREATED } from '@constants/masterData';

const message = defineMessages({
    objectName: 'promotion',
    home: 'Home',
    promotion: 'Promotion',
});

function PromotionSavePage() {
    const translate = useTranslate();
    const { restaurantId } = useParams();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.promotion.getById,
            create: apiConfig.promotion.create,
            update: apiConfig.promotion.update,
        },
        options: {
            getListUrl: generatePath(routes.promotionListPage.path, { restaurantId }),
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true)
                    return {
                        ...response.data,
                        startDate: convertUtcToIso(response.data.startDate),
                        endDate: convertUtcToIso(response.data.endDate),
                    };
            };

            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    startDate: convertIsoToUtc(data.startDate),
                    endDate: convertIsoToUtc(data.endDate),
                    promotionId: detail.id,
                    prefix: data.prefix ? data.prefix : null,
                    serviceId: data.serviceDto?.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    startDate: convertIsoToUtc(data.startDate),
                    endDate: convertIsoToUtc(data.endDate),
                    prefix: data.prefix ? data.prefix : null,
                    serviceId: data.serviceDto?.id,
                    state: STATE_PROMOTION_CREATED,
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                {
                    path: generatePath(routes.promotionListPage.path, { restaurantId }),
                    breadcrumbName: translate.formatMessage(message.promotion),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <PromotionForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                mixinFuncs={mixinFuncs}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
}

export default PromotionSavePage;
