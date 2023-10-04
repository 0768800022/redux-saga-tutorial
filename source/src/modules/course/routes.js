import apiConfig from '@constants/apiConfig';
import CourseListPage from '.';
import CourseSavePage from './CourseSavePage';
import LectureListPage from './lecture';
export default {
    courseListPage: {
        path: '/course',
        title: 'Course List Page',
        auth: true,
        component: CourseListPage,
        permissions: apiConfig.course.getList.baseURL,
    },
    courseSavePage: {
        path: '/course/:id',
        title: 'Course Save Page',
        auth: true,
        component: CourseSavePage,
        permissions: [apiConfig.course.update.baseURL, apiConfig.course.create.baseURL],
    },
    lectureListPage: {
        path: '/course/task/lecture',
        title: 'Lecture List Page',
        auth: true,
        component: LectureListPage,
        permissions: apiConfig.lecture.getList.baseURL,
    },
};
