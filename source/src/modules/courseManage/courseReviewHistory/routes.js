import apiConfig from '@constants/apiConfig';
import CourseReviewHistoryListPage from '.';
import CourseReviewHistoryListSavePage from './CourseSavePage';
export default {
    courseReviewHistoryListPage: {
        path: '/course-review-history',
        title: 'Course review history List Page',
        auth: true,
        component: CourseReviewHistoryListPage,
        permissions: apiConfig.courseReviewHistory.getList.baseURL,
    },
    courseReviewHistorySavePage: {
        path: '/course-review-history/:id',
        title: 'Course review history Save Page',
        auth: true,
        component: CourseReviewHistoryListSavePage,
        permissions: [apiConfig.course.update.baseURL, apiConfig.course.create.baseURL],
    },
};