import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useParams } from 'react-router-dom';
import routes from './routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import ReviewForm from './ReviewForm';
const messages = defineMessages({
    objectName: 'review',
    home: 'Home',
    review: 'Review',
    viewReview: 'View Review',
});
function ReviewSavePage() {
    const { restaurantId } = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.review.getById,
            create: apiConfig.review.create,
        },
        options: {
            getListUrl: generatePath(routes.reviewListPage.path, { restaurantId }),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    serviceCategoryId: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                {
                    breadcrumbName: translate.formatMessage(messages.review),
                    path: generatePath(routes.reviewListPage.path, { restaurantId }),
                },
                { breadcrumbName: translate.formatMessage(messages.viewReview) },
            ]}
            title={title}
        >
            <ReviewForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
}

export default ReviewSavePage;
