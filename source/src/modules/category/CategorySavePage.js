import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { categoryKind } from '@constants/masterData';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import routes from './routes';
import CategoryForm from './CategoryForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    objectName: 'category',
    home: 'Home',
    category: 'Service Category',
});

function CategorySavePage() {
    const { restaurantId } = useParams();
    const translate = useTranslate();

    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.category.getById,
            create: apiConfig.category.create,
            update: apiConfig.category.update,
        },
        options: {
            getListUrl: generatePath(routes.categoryListPage.path),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
     
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    categoryKind: 1,
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
                    breadcrumbName: translate.formatMessage(messages.category),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CategoryForm
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

export default CategorySavePage;
