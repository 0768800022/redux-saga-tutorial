import apiConfig from '@constants/apiConfig';
import ProjectListPage from '.';
import ProjectSavePage from './projectSavePage';
import ProjectMemberListPage from './member';
import ProjectMemberSavePage from './member/ProjectMemberSavePage';
import ProjectLeaderListPage from './projectLeader';
import TeamListPage from './team';
import TeamSavePage from './team/TeamSavePage';
import ProjectLeaderMemberListPage from './projectLeader/projectLeaderMember';
import ProjectLeaderTaskListPage from './projectLeader/projectLeaderTask';
import ProjectLeaderTeamListPage from './projectLeader/projectLeaderGroup';
import ProjectStudentListPage from './projectStudent';
import ProjectStudentTaskListPage from './projectStudent/projectStudentTask';
import ProjectStudentMemberListPage from './projectStudent/projectStudentMember';
import projectLeaderTaskLogListPage from './projectLeader/projectLeaderTaskLog';
export default {
    projectListPage: {
        path: '/project',
        title: 'Project',
        auth: true,
        component: ProjectListPage,
        // permissions: [apiConfig.leader.getList.baseURL],
    },
    projectSavePage: {
        path: '/project/:id',
        title: 'Project Save Page',
        auth: true,
        component: ProjectSavePage,
        // permission: [apiConfig.leader.create.baseURL, apiConfig.leader.update.baseURL],
    },
    projectMemberListPage: {
        path: '/project/member',
        title: 'Project Member',
        auth: true,
        component: ProjectMemberListPage,
        permissions: [apiConfig.memberProject.getList.baseURL],
    },
    projectMemberSavePage: {
        path: '/project/member/:id',
        title: 'Project Save Page',
        auth: true,
        component: ProjectMemberSavePage,
        permission: [apiConfig.memberProject.create.baseURL, apiConfig.memberProject.update.baseURL],
    },
    projectLeaderListPage: {
        path: '/project-leader',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderListPage,
        permission: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderMemberListPage: {
        path: '/project-leader/member',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderMemberListPage,
        permission: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderTaskListPage: {
        path: '/project-leader/task',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderTaskListPage,
        permission: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderTeamListPage: {
        path: '/project-leader/team',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderTeamListPage,
        permission: [apiConfig.project.getListLeader.baseURL],
    },
    teamListPage: {
        path: '/project/team',
        title: 'Team List Page',
        auth: true,
        component: TeamListPage,
        // permissions: [apiConfig.leader.getList.baseURL],
    },
    teamSavePage: {
        path: '/project/team/:id',
        title: 'Team Save Page',
        auth: true,
        component: TeamSavePage,
        // permission: [apiConfig.leader.create.baseURL, apiConfig.leader.update.baseURL],
    },
    projectStudentListPage: {
        path: '/project-student',
        title: 'Project Student Page',
        auth: true,
        component: ProjectStudentListPage,
        permission: [apiConfig.project.getListStudent.baseURL],
    },
    projectStudentTaskListPage: {
        path: '/project-student/task',
        title: 'Project Student Task Page',
        auth: true,
        component: ProjectStudentTaskListPage,
        permission: [apiConfig.project.getListStudent.baseURL],
    },
    projectStudentMemberListPage: {
        path: '/project-student/member',
        title: 'Project Student Task Page',
        auth: true,
        component: ProjectStudentMemberListPage,
        permission: [apiConfig.project.getListStudent.baseURL],
    },
    projectLeaderTaskLogListPage: {
        path: '/project-leader/task/task-log',
        title: 'Project Leader Page',
        auth: true,
        component: projectLeaderTaskLogListPage,
        permission: [apiConfig.projectTaskLog.getList.baseURL],
    },
};
