import PageNotFound from '@components/common/page/PageNotFound';
import categoryRoutes from '@modules/category/routes';
import orderRoutes from '@modules/order/routes';
import Dashboard from '@modules/dashboard';
import groupFoodRoutes from '@modules/groupFood/routes';
import customerRoutes from '@modules/customer/routes';
import settingRoutes from '@modules/setting/routes';
import promotionRoutes from '@modules/promotion/routes';
import promotionListCodeRoutes from '@modules/promotion/promotionlistcode/routes';
import LoginPage from '@modules/login/index';
import ProfilePage from '@modules/profile/index';
import reviewRoutes from '@modules/review/routes';
import PageNotAllowed from '@components/common/page/PageNotAllowed';
import RestaurantSavePage from '@modules/restaurant/RestaurantSavePage';
import reportRoutes from '@modules/report/routes';
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
    restaurantSavePage: {
        path: '/:restaurantId/config',
        title: 'Order Setting',
        auth: true,
        component: RestaurantSavePage,
        permissions: [],
    },
    ...categoryRoutes,
    ...groupFoodRoutes,
    ...settingRoutes,
    ...customerRoutes,
    ...promotionRoutes,
    ...promotionListCodeRoutes,
    ...orderRoutes,
    ...reviewRoutes,
    ...reportRoutes,
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
