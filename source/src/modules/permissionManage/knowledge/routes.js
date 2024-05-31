import KnowledgePermissionListPage from ".";
import KnowledgePermissionSavePage from "./knowledgePermissionSavePage";


export default {
    permissionListPageKnowledge: {
        path: '/permission-knowledge-category',
        title: 'Permission knowledge',
        auth: true,
        component: KnowledgePermissionListPage,
        // permissions: apiConfig.category.getById.baseURL,
    },
    permissionSavePageKnowledge: {
        path: '/permission-knowledge-category/:id',
        title: 'Permission knowledge Save Page',
        auth: true,
        component: KnowledgePermissionSavePage,
        // permissions: [apiConfig.category.getById.baseURL],
    },
};
