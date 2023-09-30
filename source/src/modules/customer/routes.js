import apiConfig from '@constants/apiConfig';
import CustomerListPage from '.';
import CustomerSavePage from './CustomerSavePage';
import CustomerOrderListPage from './CustomerOrderListPage';
export default {
    customerListPage: {
        path: '/:restaurantId/account/customer',
        title: 'Customer',
        auth: true,
        permissions: [ apiConfig.customer.getList.baseURL ],
        component: CustomerListPage,
    },
    customerSavePage: {
        path: '/:restaurantId/account/customer/:id',
        title: 'Customer',
        auth: true,
        component: CustomerSavePage,
    },
    customerOrderListPage: {
        path: '/:restaurantId/account/customer/order/:phone',
        title: 'Customer Order',
        auth: true,
        component: CustomerOrderListPage,
    },
};
