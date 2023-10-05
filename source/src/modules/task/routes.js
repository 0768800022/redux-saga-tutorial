import TaskListPage from '.';
import TaskSavePage from './TaskSavePage';

export default {
    taskListPage: {
        path: '/course/task',
        title: 'Task',
        auth: true,
        component: TaskListPage,
    },
    taskSavePage: {
        path: '/course/task/:id',
        title: 'Task Save Page',
        auth: true,
        component: TaskSavePage,
    },
};
