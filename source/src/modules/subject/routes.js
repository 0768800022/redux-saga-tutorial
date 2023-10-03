import apiConfig from '@constants/apiConfig';
import SubjectListPage from '.';
import SubjectSavePage from './SubjectSavePage';

export default {
    subjectListPage: {
        path: '/subject',
        title: 'Subject List Page',
        auth: true,
        component: SubjectListPage,
        permissions: apiConfig.subject.getList.baseURL,
    },
    subjectSavePage: {
        path: '/subject/:id',
        title: 'Subject Save Page',
        auth: true,
        component: SubjectSavePage,
        permissions: [apiConfig.subject.update.baseURL, apiConfig.subject.create.baseURL],
    },
};
