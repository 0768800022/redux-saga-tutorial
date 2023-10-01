import apiConfig from "@constants/apiConfig";
import CategoryListPage from ".";
import CategorySavePage from "./CategorySavePage";

export default {
    categoryListPage: {
        path: '/category',
        title: 'Category',
        auth: true,
        component: CategoryListPage,
        // permissions: apiConfig.category.getById.baseURL,
    },
    categorySavePage: {
        path: '/category/:id',
        title: 'Category Save Page',
        auth: true,
        component: CategorySavePage,
        permissions: [ apiConfig.category.getById.baseURL ],
    },
};