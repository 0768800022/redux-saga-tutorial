import apiConfig from "@constants/apiConfig";
import StudentListPage from ".";
import StudentSavePage from "./studentSavePage";
import CourseListPage5 from "@modules/student/CourseOfStudent/index";

export default {
    studentListPage: {
        path: '/student',
        title: 'Student',
        auth: true,
        component: StudentListPage,
        permissions: apiConfig.student.getList.baseURL,
    },
    studentSavePage: {
        path: '/student/:id',
        title: 'Student Save Page',
        auth: true,
        component: StudentSavePage,
        permission: [apiConfig.student.create.baseURL, apiConfig.student.update.baseURL],
    },
    studentCourseListPage: {
        path: '/student/course',
        title: 'Student Course List Page',
        auth: true,
        component: CourseListPage5,
        permission: apiConfig.course.getList.baseURL,
    },
};