import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useParams } from 'react-router-dom';
import SalaryPeriodForm from './SalaryPeriodForm';
import routes from './routes';

const messages = defineMessages({
    objectName: 'Kỳ lương',
});

const SalaryPeriodSavePage = () => {
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: apiConfig.salaryPeriod,
        options: {
            getListUrl: generatePath(routes.salaryPeriodListPage.path),
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
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(messages.objectName),
                    path: generatePath(routes.salaryPeriodListPage.path),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <SalaryPeriodForm
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

export default SalaryPeriodSavePage;
