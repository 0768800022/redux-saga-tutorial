import apiConfig from '@constants/apiConfig';
import DeveloperCourseKnowledgeListPage from '.';
export default {
    developerKnowledgeListPage: {
        path: '/knowledge/developer-knowledge',
        title: 'Developer',
        auth: true,
        component: DeveloperCourseKnowledgeListPage,
        permissions: [apiConfig.knowledgePermission.getList.baseURL],
    },

};
