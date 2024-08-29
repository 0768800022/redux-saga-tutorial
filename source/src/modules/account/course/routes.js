import apiConfig from "@constants/apiConfig";
import CourseListPage from ".";
import CourseSavePage from "./courseSavePage";

export default {
    courseListPage: {
        path: '/course',
        title: 'Course',
        auth: true,
        component: CourseListPage,
        permissions: [apiConfig.course.getList.baseURL],
    },
    courseSavePage: {
        path: '/course/:id',
        title: 'Course Save Page',
        auth: true,
        component: CourseSavePage,
        permissions: [apiConfig.course.create.baseURL, apiConfig.course.update.baseURL],
    },
   
   
};
