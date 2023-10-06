import apiConfig from '@constants/apiConfig';
import ProjectRoleListPage from '.';
import ProjectRoleSavePage from './projectRoleSavePage';

export default {
    projectRoleListPage: {
        path: '/projectRole',
        title: 'Project Role',
        auth: true,
        component: ProjectRoleListPage,
        // permissions: [apiConfig.leader.getList.baseURL],
    },
    projectRoleSavePage: {
        path: '/projectRole/:id',
        title: 'Project Role Save Page',
        auth: true,
        component: ProjectRoleSavePage,
        // permission: [apiConfig.leader.create.baseURL, apiConfig.leader.update.baseURL],
    },
};
