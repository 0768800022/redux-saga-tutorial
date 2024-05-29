import apiConfig from '@constants/apiConfig';
import CategoryListPage from '.';
import CategorySavePage from './CategorySavePage';

export default {
    categoryListPageKnowledge: {
        path: '/category-knowledge',
        title: 'Category knowledge',
        auth: true,
        component: CategoryListPage,
        permissions: apiConfig.category.getById.baseURL,
    },
    categorySavePageKnowledge: {
        path: '/category-knowledge/:id',
        title: 'Category Save Page',
        auth: true,
        component: CategorySavePage,
        permissions: [apiConfig.category.getById.baseURL],
    },
};
