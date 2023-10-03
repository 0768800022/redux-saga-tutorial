import RegistrationListPage from '.';
import RegistrationSavePage from './RegistrationSavePage';

export default {
    registrationListPage: {
        path: '/course/registration',
        title: 'Registration',
        auth: true,
        component: RegistrationListPage,
    },
    registrationSavePage: {
        path: '/course/registration/:id',
        title: 'Registration Save Page',
        auth: true,
        component: RegistrationSavePage,
    },
};
