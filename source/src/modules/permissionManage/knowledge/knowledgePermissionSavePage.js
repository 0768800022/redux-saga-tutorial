import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import routes from './routes';
import CategoryForm from './knowledgePermissionForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { categoryKinds } from '@constants';
import KnowledgePermissionForm from './knowledgePermissionForm';
const messages = defineMessages({
    objectName: 'phân quyền',
    permission: 'Phân quyền kiến thức',
});

const KnowledgePermissionSavePage = () => {
    const categoryId = useParams();
    const translate = useTranslate();

    const queryParameters = new URLSearchParams(window.location.search);
    const knowledgeId = queryParameters.get('knowledgeId');
    // const parentId = queryParameters.get("parentId");

    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            // getById: apiConfig.category.getById,
            create: apiConfig.knowledgePermission.create,
            update: apiConfig.knowledgePermission.update,
        },
        options: {
            getListUrl: generatePath(routes.permissionListPageKnowledge.path, { categoryId }),
            // getListUrl: routes.categoryListPageGen.path,
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    knowledgeId: knowledgeId,
                };
            };
            // funcs.prepareCreateData = (data) => {
            //     return {
            //         ...data,
            //         categoryKind: kindOfKnowledge,
            //         categoryOrdering: 0,
            //     };
            // };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(messages.permission),
                    path: generatePath(routes.permissionListPageKnowledge.path, { categoryId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <KnowledgePermissionForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};
export default KnowledgePermissionSavePage;
