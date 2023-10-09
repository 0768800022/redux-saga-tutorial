import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from './routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import CompanySubscriptionForm from './CompanySubscriptionForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
const message = defineMessages({
    objectName: 'Đăng ký mới',
    home: 'Trang chủ',
    company: 'Gói dịch vụ',
});

const CompanySubscriptionSavePage = () => {
    const CompanySubscriptionId = useParams();
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const companyId = queryParameters.get('companyId');
    const projectName = queryParameters.get('projectName');
    console.log("CompanySubscriptionSavePage "+companyId);
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.companySubscription.getById,
            create: apiConfig.companySubscription.create,
            update: apiConfig.companySubscription.update,
        },
        options: {
            getListUrl: routes.companySubscriptionListPage.path,
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
                { breadcrumbName: translate.formatMessage(message.home) },
                {
                    breadcrumbName: translate.formatMessage(message.company),
                    path: generatePath(routes.companySubscriptionListPage.path, { CompanySubscriptionId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CompanySubscriptionForm
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
export default CompanySubscriptionSavePage;