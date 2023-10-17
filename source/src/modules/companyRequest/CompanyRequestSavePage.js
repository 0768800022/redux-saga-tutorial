import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from '@routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import CompanyRequestForm from './CompanyRequestForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
import { useState } from 'react';
import { Button } from 'antd';
import ListPage from '@components/common/layout/ListPage';

const message = defineMessages({
    objectName: 'Yêu cầu công ty',
});

const CompanyRequestSavePage = () => {
    const CompanyRequestId = useParams();
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const companyId = queryParameters.get('companyId');
    const projectName = queryParameters.get('projectName');
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.companyRequest.getById,
            create: apiConfig.companyRequest.create,
            update: apiConfig.companyRequest.update,
        },
        options: {
            getListUrl: routes.companyRequestListPage.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                if (companyId !== null) {
                    return {
                        ...data,
                        companyId: companyId,
                    };
                }
                return { ...data };
            };
        },

    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.companyRequest),
                    path: generatePath(routes.companyRequestListPage.path, { CompanyRequestId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CompanyRequestForm
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail ? detail : {}}
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
            />
        </PageWrapper>
    );
};
export default CompanyRequestSavePage;