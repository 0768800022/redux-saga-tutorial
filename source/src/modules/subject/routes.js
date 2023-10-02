import SubjectListPage from '.';
import SubjectSavePage from './SubjectSavePage';

export default {
    subjectListPage: {
        path: '/subject',
        title: 'Subject List Page',
        auth: true,
        component: SubjectListPage,
        // permissions: apiConfig.category.getById.baseURL,
    },
    subjectSavePage: {
        path: '/subject/:id',
        title: 'Subject Save Page',
        auth: true,
        component: SubjectSavePage,
        // permissions: [ apiConfig.category.getById.baseURL ],
    },
};
