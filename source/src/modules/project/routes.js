import apiConfig from '@constants/apiConfig';
import ProjectListPage from '.';
import ProjectSavePage from './projectSavePage';
import ProjectMemberListPage from './member';
import ProjectMemberSavePage from './member/ProjectMemberSavePage';
import ProjectLeaderListPage from './projectLeader';
export default {
    projectListPage: {
        path: '/project',
        title: 'Project',
        auth: true,
        component: ProjectListPage,
        // permissions: [apiConfig.leader.getList.baseURL],
    },
    projectSavePage: {
        path: '/project/:id',
        title: 'Project Save Page',
        auth: true,
        component: ProjectSavePage,
        // permission: [apiConfig.leader.create.baseURL, apiConfig.leader.update.baseURL],
    },
    projectMemberListPage: {
        path: '/project/member',
        title: 'Project Member',
        auth: true,
        component: ProjectMemberListPage,
        // permissions: [apiConfig.leader.getList.baseURL],
    },
    projectMemberSavePage: {
        path: '/project/member/:id',
        title: 'Project Save Page',
        auth: true,
        component: ProjectMemberSavePage,
        // permission: [apiConfig.leader.create.baseURL, apiConfig.leader.update.baseURL],
    },
    projectLeaderListPage: {
        path: '/project-leader',
        title: 'Project List Page',
        auth: true,
        component: ProjectLeaderListPage,
        // permission: [apiConfig.leader.create.baseURL, apiConfig.leader.update.baseURL],
    },
};
