import PageNotFound from '@components/common/page/PageNotFound';
import categoryRoutesEdu from '@modules/category/categoryEdu/routes';
import categoryRoutesGen from '@modules/category/categoryGen/routes';
import categoryRoutesMajor from '@modules/category/categoryMajor/routes';
import studentRoutes from '@modules/student/routes';
import Dashboard from '@modules/dashboard';
import LoginPage from '@modules/login/index';
import ProfilePage from '@modules/profile/index';
import PageNotAllowed from '@components/common/page/PageNotAllowed';
import subjectRoutes from '@modules/subject/routes';
import courseRoutes from '@modules/course/routes';
import registrationRoutes from '@modules/registration/routes';
import leaderRoutes from '@modules/leader/routes';
import taskRoutes from '@modules/task/routes';
import projectRoutes from '@modules/project/routes';
import projectRoleRoutes from '@modules/projectRole/routes';
import developerRoutes from '@modules/developer/routes';
import projectTaskRoutes from '@modules/projectTask/routes';
import companyRoutes from '@modules/company/routes';

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

    ...subjectRoutes,
    ...courseRoutes,
    ...categoryRoutesEdu,
    ...categoryRoutesGen,
    ...categoryRoutesMajor,
    ...registrationRoutes,
    ...studentRoutes,
    ...leaderRoutes,
    ...taskRoutes,
    ...projectRoutes,
    ...projectRoleRoutes,
    ...developerRoutes,
    ...projectTaskRoutes,
    ...companyRoutes,

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
