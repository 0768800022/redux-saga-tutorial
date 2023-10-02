import CourseListPage from '.';
import CourseSavePage from './CourseSavePage';

export default {
    courseListPage: {
        path: '/course',
        title: 'Course List Page',
        auth: true,
        component: CourseListPage,
        // permissions: apiConfig.category.getById.baseURL,
    },
    courseSavePage: {
        path: '/course/:id',
        title: 'Course Save Page',
        auth: true,
        component: CourseSavePage,
        // permissions: [ apiConfig.category.getById.baseURL ],
    },
};
