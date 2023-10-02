import RegistrationListPage from '.';
import RegistrationSavePage from './RegistrationSavePage';

export default {
    registrationListPage: {
        path: '/registration',
        title: 'Registration',
        auth: true,
        component: RegistrationListPage,
    },
    registrationSavePage: {
        path: '/registration/:id',
        title: 'Registration Save Page',
        auth: true,
        component: RegistrationSavePage,
    },
};
