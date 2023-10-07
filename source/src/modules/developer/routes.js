import apiConfig from '@constants/apiConfig';
import DeveloperSavePage from './DeveloperSavePage';
import DeveloperListPage from '.';

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
        permission: [apiConfig.leader.create.baseURL, apiConfig.leader.update.baseURL],
    },
};
