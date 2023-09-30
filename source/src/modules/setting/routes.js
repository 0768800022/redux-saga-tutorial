import SettingPage from '.';

export default {
    // settingGeneralListPage: {
    //     path: '/:restaurantId/general',
    //     title: 'General Setting',
    //     auth: true,`
    //     component: GeneralSettingSavePage,
    //     permissions: [],
    // },
    settingPage: {
        path: '/:restaurantId/settings',
        title: 'Order Setting',
        auth: true,
        component: SettingPage,
        permissions: [],
    },
    // categorySavePage: {
    //     path: '/category/:kind/:id',
    //     title: 'Category Save Page',
    //     auth: true,
    //     component: CategorySavePage,
    //     permissions: [ apiConfig.category.getById.baseURL ],
    // },
};
