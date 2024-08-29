import apiConfig from "@constants/apiConfig";

import SubjectSavePage from "./subjectSavePage";
import SubjectListPage from ".";
import LectureListPage from "./lecture";

export default {
    subjectListPage: {
        path: '/subject',
        title: 'Subject',
        auth: true,
        component: SubjectListPage,
        permissions: [apiConfig.subject.getList.baseURL],
    },

    subjectSavePage: {
        path: '/subject/:id',
        title: 'Subject Save Page',
        auth: true,
        component: SubjectSavePage,
        permissions: [apiConfig.subject.create.baseURL, apiConfig.subject.update.baseURL],
    },
   
    lectureListPage: {
        path: '/subject/lecture/:id',
        title: 'Lecture',
        auth: true,
        component: LectureListPage,
        permissions: [apiConfig.lecture.getBySubject.baseURL],
    },

};
