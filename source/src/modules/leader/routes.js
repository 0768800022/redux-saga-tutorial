import apiConfig from '@constants/apiConfig';
import LeaderListPage from '.';
import LeaderSavePage from './leaderSavePage';
import ProjectListPage from '@modules/project';
import ProjectTaskListPage from '@modules/projectTask';
import CourseListPage from '@modules/course';
import TaskListPage from '@modules/task';

export default {
    leaderListPage: {
        path: '/leader',
        title: 'Leader',
        auth: true,
        component: LeaderListPage,
        permissions: [apiConfig.leader.getList.baseURL],
    },
    leaderSavePage: {
        path: '/leader/:id',
        title: 'Leader Save Page',
        auth: true,
        component: LeaderSavePage,
        permission: [apiConfig.leader.create.baseURL, apiConfig.leader.update.baseURL],
    },
    leaderCourseListPage: {
        path: '/leader/course',
        title: 'Leader',
        auth: true,
        component: CourseListPage,
        permissions: [apiConfig.leader.getList.baseURL],
    },
    leaderProjectListPage: {
        path: '/leader/project',
        title: 'Leader Project Page',
        auth: true,
        component: ProjectListPage,
        // permissions: [apiConfig.leader.getList.baseURL],
    },
    leaderProjectTaskListPage: {
        path: '/leader/project/task',
        title: 'Leader Project Task Page',
        auth: true,
        component: ProjectTaskListPage,
        // permissions: [apiConfig.leader.getList.baseURL],
    },
    leaderCourseTaskListPage: {
        path: '/leader/course/task',
        title: 'Leader Project Task Page',
        auth: true,
        component: TaskListPage,
        // permissions: [apiConfig.leader.getList.baseURL],
    },
};
