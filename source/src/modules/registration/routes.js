import apiConfig from '@constants/apiConfig';
import RegistrationListPage from '.';
import RegistrationSavePage from './RegistrationSavePage';

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
};
