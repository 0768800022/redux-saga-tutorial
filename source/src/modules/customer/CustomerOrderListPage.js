import React from 'react';
import { defineMessages } from 'react-intl';
import { Link, generatePath, useParams } from 'react-router-dom';
import OrderListPage from '@modules/order';
import useTranslate from '@hooks/useTranslate';
import routes from './routes';
const message = defineMessages({
    customer: 'Customer',
});
function CustomerOrderListPage() {
    const translate = useTranslate();
    const { restaurantId, phone, id } = useParams();
    return (
        <OrderListPage
            customerPhone={phone}
            additionRoute={{
                breadcrumbName: translate.formatMessage(message.customer),
                path: generatePath(routes.customerListPage.path, { restaurantId }),
            }}
        />
    );
}

export default CustomerOrderListPage;
