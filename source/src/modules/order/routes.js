import apiConfig from "@constants/apiConfig";
import OrderListPage from ".";
import OrderSavePage from "./OrderSavePage";
import OrderViewPage from "./OrderViewPage";

export default {
    orderListPage: {
        path: '/:restaurantId/menu/order',
        title: 'Order',
        auth: true,
        component: OrderListPage,
    },
    orderSavePage: {
        path: '/:restaurantId/menu/order/:id/:phone',
        title: 'Order Save Page',
        auth: true,
        component: OrderSavePage,
    },
    orderViewPage: {
        path: '/:restaurantId/menu/order/:id/:phone/view',
        title: 'Order View Page',
        auth: true,
        component: OrderViewPage,
    },
    customerOrderSavePage: {
        path: '/:restaurantId/menu/order/customer/:id/:phone/:type',
        title: 'Customer Order Save Page',
        auth: true,
        component: OrderSavePage,
    },
    customerOrderViewPage: {
        path: '/:restaurantId/menu/order/customer/:id/:phone/:type/view',
        title: 'Customer Order View Page',
        auth: true,
        component: OrderViewPage,
    },
};