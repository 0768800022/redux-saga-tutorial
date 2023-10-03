import PageNotFound from '@components/common/page/PageNotFound';
import categoryRoutes from '@modules/category/routes';
import categoryRoutesEdu from '@modules/categoryEdu/routes';
import categoryRoutesGen from '@modules/categoryGen/routes';
import studentRoutes from '@modules/student/routes';
import Dashboard from '@modules/dashboard';
import LoginPage from '@modules/login/index';
import ProfilePage from '@modules/profile/index';
import PageNotAllowed from '@components/common/page/PageNotAllowed';
import subjectRoutes from '@modules/subject/routes';
import courseRoutes from '@modules/course/routes';
import RegistrationRoutes from '@modules/registration/routes';
import LeaderRouter from '@modules/leader/routes';
/*
	auth
		+ null: access login and not login
		+ true: access login only
		+ false: access not login only
*/
const routes = {
    pageNotAllowed: {
        path: '/not-allowed',
        component: PageNotAllowed,
        auth: null,
        title: 'Page not allowed',
    },
    homePage: {
        path: '/',
        component: Dashboard,
        auth: true,
        title: 'Home',
    },
    settingPage: {
        path: '/setting',
        component: Dashboard,
        auth: true,
        title: 'Setting',
    },
    loginPage: {
        path: '/login',
        component: LoginPage,
        auth: false,
        title: 'Login page',
    },
    profilePage: {
        path: '/profile',
        component: ProfilePage,
        auth: true,
        title: 'Profile page',
    },
    ...categoryRoutes,
    ...subjectRoutes,
    ...courseRoutes,
    ...categoryRoutesEdu,
    ...categoryRoutesGen,
    ...RegistrationRoutes,
    ...studentRoutes,
    ...LeaderRouter,
    // keep this at last
    //
    notFound: {
        component: PageNotFound,
        auth: null,
        title: 'Page not found',
        path: '*',
    },
};

export default routes;
