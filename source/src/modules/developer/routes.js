import apiConfig from '@constants/apiConfig';
import DeveloperSavePage from './DeveloperSavePage';
import DeveloperListPage from '.';
import ProjectListPage from '@modules/project';
import ProjectTaskListPage from '@modules/projectTask';

export default {
    developerListPage: {
        path: '/developer',
        title: 'Developer',
        auth: true,
        component: DeveloperListPage,
        permissions: [apiConfig.developer.getList.baseURL],
    },
    developerSavePage: {
        path: '/developer/:id',
        title: 'Developer Save Page',
        auth: true,
        component: DeveloperSavePage,
        permission: [apiConfig.developer.create.baseURL, apiConfig.developer.update.baseURL],
    },
    developerProjectListPage: {
        path: '/developer/project',
        title: 'Developer',
        auth: true,
        component: ProjectListPage,
        permissions: [apiConfig.project.getList.baseURL],
    },
    developerProjectTaskListPage: {
        path: '/developer/project/task',
        title: 'Developer',
        auth: true,
        component: ProjectTaskListPage,
        permissions: [apiConfig.projectTask.getList.baseURL],
    },
};
