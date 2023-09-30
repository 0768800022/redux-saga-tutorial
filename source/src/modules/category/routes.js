import apiConfig from "@constants/apiConfig";
import CategoryListPage from ".";
import CategorySavePage from "./CategorySavePage";

export default {
    categoryListPage: {
        path: '/:restaurantId/menu/category-service',
        title: 'Category',
        auth: true,
        component: CategoryListPage,
        permissions: apiConfig.category.getList.baseURL,
    },
    categorySavePage: {
        path: '/:restaurantId/menu/category-service/:id',
        title: 'Category Save Page',
        auth: true,
        component: CategorySavePage,
        permissions: [ apiConfig.category.getById.baseURL ],
    },
};