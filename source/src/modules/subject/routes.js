import apiConfig from '@constants/apiConfig';
import SubjectListPage from '.';
import SubjectSavePage from './SubjectSavePage';
import LectureListPage from './lecture/index';
import LectureSavePage from './lecture/lectureSavePage';

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
    lectureListPage:{
        path: '/subject/lecture/get-by-subject/:subjectId',
        title: 'lecture List Page',
        auth: true,
        component: LectureListPage,
    },

    lectureSavePage: {
        path: '/subject/lecture/get-by-subject/:subjectId/:id',
        title: 'Lecture Save Page',
        auth: true,
        component: LectureSavePage,
    },
};
