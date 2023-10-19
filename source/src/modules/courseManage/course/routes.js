import apiConfig from '@constants/apiConfig';
import CourseListPage from '.';
import CourseSavePage from './CourseSavePage';
import LectureListPage from './lecture';
import CourseLeaderListPage from './leader/courseLeader';
import TaskListPage from './leader/taskLeader';
import TaskLeaderSavePage from './leader/taskLeader/TaskSavePage';
import AsignAllListPage from './leader/asignAll';
import CourseStudentListPage from './student/courseStudent';
import TaskStudentListPage from './student/taskStudent';
import RegistrationLeaderListPage from './leader/registrationLeader';
import TaskLogLeaderSavePage from './leader/taskLog/TaskLogLeaderSavePage';
import routes from '@routes';
import TaskLogLeaderListPage from './leader/taskLog';
export default {
    courseListPage: {
        path: '/course',
        title: 'Course List Page',
        auth: true,
        component: CourseListPage,
        permission: apiConfig.course.getList.baseURL,
    },
    courseLeaderListPage: {
        path: '/course-leader',
        title: 'Course List Page',
        auth: true,
        component: CourseLeaderListPage,
        permission: apiConfig.course.getListLeaderCourse.baseURL,
    },
    courseSavePage: {
        path: '/course/:id',
        title: 'Course Save Page',
        auth: true,
        component: CourseSavePage,
        permission: [apiConfig.course.create.baseURL,apiConfig.course.update.baseURL],
    },
    lectureTaskListPage: {
        path: '/course/task/lecture',
        title: 'Lecture List Page',
        auth: true,
        component: LectureListPage,
        separateCheck: true,
        permission: [apiConfig.lecture.getList.baseURL],
        breadcrumbs: (message, paramHead, state, location) => {
            return [
                { breadcrumbName: message.course.defaultMessage, path: paramHead },
                { breadcrumbName: message.task.defaultMessage, path: state + location },
                { breadcrumbName: message.objectName.defaultMessage },
            ];
        },
    },

    taskLeaderListPage: {
        path: '/course-leader/task/:courseId',
        title: 'Task List Page',
        auth: true,
        component: TaskListPage,
        permission: [apiConfig.task.courseTask.baseURL],
    },
    taskLeaderSavePage: {
        path: '/course-leader/task/:courseId/:id',
        title: 'Task Save Page',
        auth: true,
        component: TaskLeaderSavePage,
        permission: [apiConfig.task.update.baseURL],
    },
    lectureTaskLeaderListPage: {
        path: '/course-leader/task/:courseId/lecture',
        title: 'Lecture Leader List Page',
        auth: true,
        component: AsignAllListPage,
        separateCheck: true,
        permission: [apiConfig.lecture.getList.baseURL],
    },
    registrationLeaderListPage: {
        path: '/course-leader/registration',
        title: 'Registration',
        auth: true,
        component: RegistrationLeaderListPage,
        permission: [apiConfig.registration.getList.baseURL],
    },

    taskLogLeaderListPage: {
        path: '/course-leader/task/:courseId/task-log',
        title: 'Task Log Leader List Page',
        auth: true,
        component: TaskLogLeaderListPage,
        permission: [apiConfig.taskLog.getList.baseURL],
    },
    taskLogLeaderSavePage: {
        path: '/course-leader/task/:courseId/task-log/:id',
        title: 'Task Log Leader Save Page',
        auth: true,
        component: TaskLogLeaderSavePage,
        permission: [apiConfig.taskLog.create.baseURL,apiConfig.taskLog.update.baseURL],
    },


    // STUDENT
    courseStudentListPage: {
        path: '/course-student',
        title: 'Course Student List Page',
        auth: true,
        component: CourseStudentListPage,
        permission: apiConfig.course.getListStudentCourse.baseURL,
    },
    taskStudentListPage: {
        path: '/course-student/task',
        title: 'Task List Page',
        auth: true,
        component: TaskStudentListPage,
        permission: [apiConfig.task.courseTask.baseURL],
    },
};
