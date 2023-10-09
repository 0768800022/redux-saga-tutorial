import apiConfig from '@constants/apiConfig';
import LeaderListPage from '.';
import LeaderSavePage from './leaderSavePage';
import CourseListPage from '@modules/student/CourseOfStudent';

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
};
