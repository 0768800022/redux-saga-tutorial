import { AppConstants, apiUrl, apiTenantUrl } from '.';

const baseHeader = {
    'Content-Type': 'application/json',
};

const multipartFormHeader = {
    'Content-Type': 'multipart/form-data',
};

const apiConfig = {
    account: {
        login: {
            baseURL: `${apiUrl}v1/account/login`,
            method: 'POST',
            headers: baseHeader,
        },
        loginBasic: {
            baseURL: `${apiUrl}api/token`,
            method: 'POST',
            headers: baseHeader,
        },
        getProfile: {
            baseURL: `${apiUrl}v1/account/profile`,
            method: 'GET',
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiUrl}v1/account/update_profile_admin`,
            method: 'PUT',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/account/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        refreshToken: {
            baseURL: `${apiUrl}v1/account/refresh_token`,
            method: 'POST',
            headers: baseHeader,
        },
        logout: {
            baseURL: `${apiUrl}v1/account/logout`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    user: {
        getList: {
            baseURL: `${apiUrl}v1/account/list`,
            method: `GET`,
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/account/auto-complete`,
            method: `GET`,
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/account/get/:id`,
            method: `GET`,
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/account/create_admin`,
            method: `POST`,
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/account/update_admin`,
            method: `PUT`,
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/account/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
        },
    },
    file: {
        upload: {
            path: `${AppConstants.mediaRootUrl}v1/file/upload`,
            method: 'POST',
            headers: multipartFormHeader,
            isRequiredTenantId: true,
            isUpload: true,
        },
    },
    category: {
        getList: {
            baseURL: `${apiTenantUrl}v1/service-category/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/service-category/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/service-category/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/service-category/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/service-category/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/service-category/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    setting: {
        getList: {
            baseURL: `${apiUrl}v1/settings/list`,
            method: `GET`,
            headers: baseHeader,
        },
        getAll: {
            baseURL: `${apiUrl}v1/settings/get-all-settings`,
            method: `GET`,
            headers: baseHeader,
        },
    },
    organize: {
        getList: {
            baseURL: `${apiUrl}v1/shop_account/list`,
            method: `GET`,
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/shop_account/get/:id`,
            method: `GET`,
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/shop_account/create`,
            method: `POST`,
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/shop_account/update`,
            method: `PUT`,
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/shop_account/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
        },
        getProfile: {
            baseURL: `${apiUrl}v1/shop_account/profile`,
            method: 'GET',
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiUrl}v1/shop_account/update_profile`,
            method: 'PUT',
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/shop_account/auto-complete`,
            method: `GET`,
            headers: baseHeader,
        },
    },
    restaurant: {
        getList: {
            baseURL: `${apiUrl}v1/store/list`,
            method: `GET`,
            headers: baseHeader,
        },
        getListByClient: {
            baseURL: `${apiUrl}v1/store/list_by_customer`,
            method: `GET`,
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/store/get/:id`,
            method: `GET`,
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/store/create`,
            method: `POST`,
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/store/update`,
            method: `PUT`,
            headers: baseHeader,
        },
        updateByClient: {
            baseURL: `${apiUrl}v1/store/update_by_customer`,
            method: `PUT`,
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/store/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/store/auto-complete`,
            method: `GET`,
            headers: baseHeader,
        },
    },
    groupFood: {
        getList: {
            baseURL: `${apiTenantUrl}v1/service/list`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/service/get/:id`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/service/create`,
            method: `POST`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/service/update`,
            method: `PUT`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/service/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    employee: {
        getList: {
            baseURL: `${apiTenantUrl}v1/employee/list`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/employee/get/:id`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/employee/create`,
            method: `POST`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/employee/update`,
            method: `PUT`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/employee/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/employee/auto-complete`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getProfile: {
            baseURL: `${apiTenantUrl}v1/employee/profile`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    manager: {
        getList: {
            baseURL: `${apiTenantUrl}v1/manager/list`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/manager/get/:id`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/manager/create`,
            method: `POST`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/manager/update`,
            method: `PUT`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/manager/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/manager/auto-complete`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getProfile: {
            baseURL: `${apiTenantUrl}v1/manager/profile`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    customer: {
        getList: {
            baseURL: `${apiTenantUrl}v1/customer/list`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/customer/get/:id`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/customer/create`,
            method: `POST`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/customer/update`,
            method: `PUT`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/customer/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/customer/auto-complete`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    food: {
        getList: {
            baseURL: `${apiTenantUrl}v1/food/list`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/food/get/:id`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/food/create`,
            method: `POST`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/food/update`,
            method: `PUT`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/food/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    promotion: {
        getList: {
            baseURL: `${apiTenantUrl}v1/promotion/list`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/promotion/get/:id`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/promotion/create`,
            method: `POST`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/promotion/update`,
            method: `PUT`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/promotion/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        activePromotion: {
            baseURL: `${apiTenantUrl}v1/promotion/active-promotion/:id`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        listPromotionCode: {
            baseURL: `${apiTenantUrl}v1/promotion/list-promotion-code`,
            method: `GET`,
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    order: {
        getList: {
            baseURL: `${apiTenantUrl}v1/order/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/order/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/order/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        deleteItem: {
            baseURL: `${apiTenantUrl}v1/order/delete-item/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/order/update-order`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    review: {
        getList: {
            baseURL: `${apiUrl}v1/review/list-client`,
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/review/get-client/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/review/create`,
            method: `POST`,
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/review/delete-client/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        // update: {
        //     baseURL: `${apiUrl}v1/review/update-order`,
        //     method: 'PUT',
        //     headers: baseHeader,
        // },
    },
    report: {
        getTotalByPaymentMethod: {
            baseURL: `${apiTenantUrl}v1/report/total-by-payment-method`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getTotalByTop10Customer: {
            baseURL: `${apiTenantUrl}v1/report/total-by-top-10-customer`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getTotalByTop50FlashSale: {
            baseURL: `${apiTenantUrl}v1/report/total-by-top-50-flash-sale`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getTotalSaleByState: {
            baseURL: `${apiTenantUrl}v1/report/total-sale-by-state`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getQuantityByDate: {
            baseURL: `${apiTenantUrl}v1/report/quantity-by-date`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
};

export default apiConfig;
