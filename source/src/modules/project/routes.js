import apiConfig from '@constants/apiConfig';
import ProjectListPage from '.';
import ProjectSavePage from './projectSavePage';
import ProjectMemberListPage from './member';
import ProjectMemberSavePage from './member/ProjectMemberSavePage';
import TeamListPage from './team';
import TeamSavePage from './team/TeamSavePage';
import ProjectTaskSavePage from '@modules/projectTask/ProjectTaskSavePage';
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
    teamListPage: {
        path: '/project/team',
        title: 'Team List Page',
        auth: true,
        component: TeamListPage,
        // permissions: [apiConfig.leader.getList.baseURL],
    },
    teamSavePage: {
        path: '/project/team/:id',
        title: 'Team Save Page',
        auth: true,
        component: TeamSavePage,
        // permission: [apiConfig.leader.create.baseURL, apiConfig.leader.update.baseURL],
    },
};
