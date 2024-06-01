import apiConfig from "@constants/apiConfig";
import KnowledgeListPage from "./knowledge";
import KnowledgeSavePage from "./knowledge/KnowledgeSavePage";
import CategoryListPage from "./categoryKnowledge";
import CategorySavePage from "./categoryKnowledge/CategorySavePage";

export default {
    knowledgeListPage: {
        path: '/knowledge',
        title: 'Knowledge List Page',
        auth: true,
        component: KnowledgeListPage,
        permissions: [apiConfig.course.getList.baseURL],
    },
    knowledgeSavePage: {
        path: '/knowledge/:id',
        title: 'Knowledge Save Page',
        auth: true,
        component: KnowledgeSavePage,
        permissions: [apiConfig.course.create.baseURL, apiConfig.course.update.baseURL],
    },
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
