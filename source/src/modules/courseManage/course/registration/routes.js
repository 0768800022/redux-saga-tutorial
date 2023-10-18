import apiConfig from '@constants/apiConfig';
import RegistrationListPage from '.';
import RegistrationSavePage from './RegistrationSavePage';
import RegistrationMoneyListPage from './registrationMoney';
import RegistrationMoneySavePage from './registrationMoney/RegistrationMoneySavePage';
export default {
    registrationListPage: {
        path: '/course/registration',
        title: 'Registration',
        auth: true,
        component: RegistrationListPage,
        permissions: [apiConfig.registration.getList.baseURL],
    },
    registrationSavePage: {
        path: '/course/registration/:id',
        title: 'Registration Save Page',
        auth: true,
        component: RegistrationSavePage,
        permissions: [apiConfig.registration.create.baseURL, apiConfig.registration.update.baseURL],
    },
    registrationMoneyListPage: {
        path: '/course/registration/money-history',
        title: 'Registration',
        auth: true,
        component: RegistrationMoneyListPage,
        permissions: [apiConfig.registration.getList.baseURL],
    },
    registrationMoneySavePage: {
        path: '/course/registration/money-history/:id',
        title: 'Registration Save Page',
        auth: true,
        component: RegistrationMoneySavePage,
        permissions: [apiConfig.registration.create.baseURL, apiConfig.registration.update.baseURL],
    },
};
