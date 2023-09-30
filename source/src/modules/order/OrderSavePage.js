import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import React, { useState, useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import routes from './routes';
import { defineMessages } from 'react-intl';
import PageWrapper from '@components/common/layout/PageWrapper';
import OrderForm from './OrderForm';
import customerRoute from '@modules/customer/routes';
const messages = defineMessages({
    objectName: 'Order',
    home: 'Home',
    order: 'List Order',
    customer: 'Customer',
});
const OrderSavePage = () => {
    const { restaurantId, id, phone, type } = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.order.getById,
            update: apiConfig.order.update,
        },
        options: {
            getListUrl: generatePath(routes.orderListPage.path, { restaurantId }),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    //  serviceCategoryId: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },
    });
    const [breadRoutes, setBreadRoutes] = useState([
        { breadcrumbName: translate.formatMessage(messages.home) },
        {
            breadcrumbName: translate.formatMessage(messages.order),
            path: generatePath(routes.orderListPage.path, { restaurantId }),
        },
        { breadcrumbName: title },
    ]);
    useEffect(() => {
        if (type) {
            setBreadRoutes(() => {
                let result = [
                    { breadcrumbName: translate.formatMessage(messages.home) },
                    {
                        breadcrumbName: translate.formatMessage(messages.customer),
                        path: generatePath(customerRoute.customerListPage.path, { restaurantId }),
                    },
                    {
                        breadcrumbName: translate.formatMessage(messages.order),
                        path: generatePath(customerRoute.customerOrderListPage.path, { restaurantId, phone }),
                    },
                    { breadcrumbName: title },
                ];
                return [...result];
            });
        }
    }, []);
    return (
        <PageWrapper loading={loading} routes={breadRoutes} title={title}>
            <OrderForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                action={'edit'}
                // actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
                onGetDetail={mixinFuncs.getDetail}
            />
        </PageWrapper>
    );
};
export default OrderSavePage;
