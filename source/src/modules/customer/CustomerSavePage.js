import PageWrapper from '@components/common/layout/PageWrapper';
import { STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import routes from '@routes';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import { parseJson } from '@utils';
import { FREE_STATE } from '@constants/masterData';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';

const messages = defineMessages({
    home: 'Home',
    customer: 'Customer',
});

const CustomerSavePage = () => {
    const { id, restaurantId } = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: apiConfig.customer,
        options: {
            getListUrl: generatePath(routes.customerListPage.path, { restaurantId }),
            objectName: translate.formatMessage(messages.customer),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    customerId: id,
                    restaurantId,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    restaurantId,
                };
            };

            funcs.mappingData = (data) => {
                return {
                    ...data.data,
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                { breadcrumbName: translate.formatMessage(messages.customer), path: generatePath(routes.customerListPage.path, { restaurantId }) },
                { breadcrumbName: title },
            ]}
        >
            <CustomerForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
            />
        </PageWrapper>
    );
};

export default CustomerSavePage;
