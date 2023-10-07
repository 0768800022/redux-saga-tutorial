import apiConfig from '@constants/apiConfig';
import ProjectTaskListPage from '.';
import ProjectTaskSavePage from './ProjectTaskSavePage';

export default {
    ProjectTaskListPage: {
        path: '/project/task',
        title: 'Task',
        auth: true,
        component: ProjectTaskListPage,
        permissions: [apiConfig.projectTask.getList.baseURL],
    },
    ProjectTaskSavePage: {
        path: '/project/task/:id',
        title: 'Task Save Page',
        auth: true,
        component: ProjectTaskSavePage,
        permissions: [apiConfig.projectTask.create.baseURL, apiConfig.projectTask.update.baseURL],
    },
};
