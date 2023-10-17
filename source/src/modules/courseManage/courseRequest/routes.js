import apiConfig from '@constants/apiConfig';
import CourseRequestListPage from '.';
import CourseRequestSavePage from './CourseRequestSavePage';
import RegistrationSavePage from '@modules/courseManage/course/registration/index';
export default {
    courseRequestListPage: {
        path: '/course-request',
        title: 'Course Request List Page',
        auth: true,
        component: CourseRequestListPage,
        permissions: apiConfig.courseRequest.getList.baseURL,
    },
    courseRequestSavePage: {
        path: '/course-request/:id',
        title: 'Course Save Page',
        auth: true,
        component: CourseRequestSavePage,
        permissions: [apiConfig.courseRequest.update.baseURL],
    },
    courseRequestRegistrationSavePage: {
        path: '/course-request/registration/:id',
        title: 'Course Save Page',
        auth: true,
        component: RegistrationSavePage,
        permissions: [apiConfig.registration.create.baseURL],
    },
};
