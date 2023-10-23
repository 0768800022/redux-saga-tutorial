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
import MyTaskStudentListPage from './student/myTask';
import routes from '@routes';
import TaskLogLeaderListPage from './leader/taskLog';
import RegistrationStudentListPage from './student/registrationStudent';
export default {
    courseListPage: {
        path: '/course',
        title: 'Course List Page',
        auth: true,
        component: CourseListPage,
        permissions: [apiConfig.course.getList.baseURL],
    },
    courseLeaderListPage: {
        path: '/course-leader',
        title: 'Course List Page',
        auth: true,
        component: CourseLeaderListPage,
        permissions: [apiConfig.course.getListLeaderCourse.baseURL],
    },
    courseSavePage: {
        path: '/course/:id',
        title: 'Course Save Page',
        auth: true,
        component: CourseSavePage,
        permissions: [apiConfig.course.create.baseURL, apiConfig.course.update.baseURL],
    },
    lectureTaskListPage: {
        path: '/course/task/lecture',
        title: 'Lecture List Page',
        auth: true,
        component: LectureListPage,
        permissions: [apiConfig.lecture.getBySubject.baseURL],
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
        permissions: [apiConfig.task.courseTask.baseURL],
    },
    taskLeaderSavePage: {
        path: '/course-leader/task/:courseId/:id',
        title: 'Task Save Page',
        auth: true,
        component: TaskLeaderSavePage,
        permissions: [apiConfig.task.create.baseURL, apiConfig.task.update.baseURL],
    },
    lectureTaskLeaderListPage: {
        path: '/course-leader/task/:courseId/lecture',
        title: 'Lecture Leader List Page',
        auth: true,
        component: AsignAllListPage,
        permissions: [apiConfig.lecture.getBySubject.baseURL],
    },
    registrationLeaderListPage: {
        path: '/course-leader/registration',
        title: 'Registration',
        auth: true,
        component: RegistrationLeaderListPage,
        permissions: [apiConfig.registration.getList.baseURL],
    },

    taskLogLeaderListPage: {
        path: '/course-leader/task/:courseId/task-log',
        title: 'Task Log Leader List Page',
        auth: true,
        component: TaskLogLeaderListPage,
        permissions: [apiConfig.taskLog.getList.baseURL],
    },
    taskLogLeaderSavePage: {
        path: '/course-leader/task/:courseId/task-log/:id',
        title: 'Task Log Leader Save Page',
        auth: true,
        component: TaskLogLeaderSavePage,
        permissions: [apiConfig.taskLog.create.baseURL, apiConfig.taskLog.update.baseURL],
    },
    // STUDENT
    courseStudentListPage: {
        path: '/course-student',
        title: 'Course Student List Page',
        auth: true,
        component: CourseStudentListPage,
        permissions: [apiConfig.course.getListStudentCourse.baseURL],
    },
    taskStudentListPage: {
        path: '/course-student/task',
        title: 'Task List Page',
        auth: true,
        component: TaskStudentListPage,
        permissions: [apiConfig.task.studentTask.baseURL],
    },
    myTaskStudentListPage: {
        path: '/my-task',
        title: 'My Task List Page',
        auth: true,
        component: MyTaskStudentListPage,
        permissions: [apiConfig.task.studentTask.baseURL],
    },
    registrationStudentListPage: {
        path: '/course-student/registration',
        title: 'Registration',
        auth: true,
        component: RegistrationStudentListPage,
        permissions: [apiConfig.registration.getList.baseURL],
    },
};
