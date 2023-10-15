import apiConfig from '@constants/apiConfig';
import CourseListPage from '.';
import CourseSavePage from './CourseSavePage';
import LectureListPage from './lecture';
import CourseLeaderListPage from './leader/courseLeader';
import TaskListPage from './leader/taskLeader';
import TaskSavePage from './leader/taskLeader/TaskSavePage';
import AsignAllListPage from './leader/asignAll';
export default {
    courseListPage: {
        path: '/course',
        title: 'Course List Page',
        auth: true,
        component: CourseListPage,
        permissions: apiConfig.course.getList.baseURL,
    },
    courseLeaderListPage: {
        path: '/course-leader',
        title: 'Course List Page',
        auth: true,
        component: CourseLeaderListPage,
        permissions: apiConfig.course.getListLeaderCourse.baseURL,
    },
    courseSavePage: {
        path: '/course/:id',
        title: 'Course Save Page',
        auth: true,
        component: CourseSavePage,
        permissions: [apiConfig.course.update.baseURL, apiConfig.course.create.baseURL],
    },
    lectureTaskListPage: {
        path: '/course/task/lecture',
        title: 'Lecture List Page',
        auth: true,
        component: LectureListPage,
        separateCheck: true,
        permissions: [apiConfig.lecture.getList.baseURL],
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
        component: TaskSavePage,
        permissions: [apiConfig.task.update.baseURL],
    },
    lectureTaskLeaderListPage: {
        path: '/course-leader/task/:courseId/lecture',
        title: 'Lecture Leader List Page',
        auth: true,
        component: AsignAllListPage,
        separateCheck: true,
        permissions: [apiConfig.lecture.getList.baseURL],
    },
};
