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
import ProjectLeaderSavePage from './projectLeader/projectLeaderSavePage';
import ProjectLeaderTaskSavePage from './projectLeader/projectLeaderTask/ProjectLeaderTaskSavePage';
import ProjectLeaderMemberForm from './projectLeader/projectLeaderMember/ProjectLeaderMemberForm';
import ProjectLeaderMemberSavePage from './projectLeader/projectLeaderMember/ProjectLeaderMemberSavePage';
import ProjectLeaderTeamSavePage from './projectLeader/projectLeaderGroup/ProjectLeaderTeamSavePage';
export default {
    projectListPage: {
        path: '/project',
        title: 'Project',
        auth: true,
        component: ProjectListPage,
        permissions: [apiConfig.project.getList.baseURL],
    },
    projectSavePage: {
        path: '/project/:id',
        title: 'Project Save Page',
        auth: true,
        component: ProjectSavePage,
        permissions: [apiConfig.project.create.baseURL, apiConfig.project.update.baseURL],
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
        permissions: [apiConfig.memberProject.create.baseURL, apiConfig.memberProject.update.baseURL],
    },
    projectLeaderListPage: {
        path: '/project-leader',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderListPage,
        permissions: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderSavePage: {
        path: '/project-leader/:id',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderSavePage,
        permission: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderMemberListPage: {
        path: '/project-leader/member',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderMemberListPage,
        permissions: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderMemberSavePage: {
        path: '/project-leader/member/:id',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderMemberSavePage,
        permission: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderTaskListPage: {
        path: '/project-leader/task',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderTaskListPage,
        permissions: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderTaskSavePage: {
        path: '/project-leader/task/:id',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderTaskSavePage,
        permission: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderTeamListPage: {
        path: '/project-leader/team',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderTeamListPage,
        permissions: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderTeamSavePage: {
        path: '/project-leader/team/:id',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderTeamSavePage,
        permission: [apiConfig.project.getListLeader.baseURL],
    },
    teamListPage: {
        path: '/project/team',
        title: 'Team List Page',
        auth: true,
        component: TeamListPage,
        permissions: [apiConfig.team.getList.baseURL],
    },
    teamSavePage: {
        path: '/project/team/:id',
        title: 'Team Save Page',
        auth: true,
        component: TeamSavePage,
        permissions: [apiConfig.team.create.baseURL, apiConfig.team.update.baseURL],
    },
    projectStudentListPage: {
        path: '/project-student',
        title: 'Project Student Page',
        auth: true,
        component: ProjectStudentListPage,
        permissions: [apiConfig.project.getListStudent.baseURL],
    },
    projectStudentTaskListPage: {
        path: '/project-student/task',
        title: 'Project Student Task Page',
        auth: true,
        component: ProjectStudentTaskListPage,
        permissions: [apiConfig.projectTask.getList.baseURL],
    },
    projectStudentMemberListPage: {
        path: '/project-student/member',
        title: 'Project Student Task Page',
        auth: true,
        component: ProjectStudentMemberListPage,
        permissions: [apiConfig.memberProject.getList.baseURL],
    },
    projectLeaderTaskLogListPage: {
        path: '/project-leader/task/task-log',
        title: 'Project Leader Page',
        auth: true,
        component: projectLeaderTaskLogListPage,
        permissions: [apiConfig.projectTaskLog.getList.baseURL],
    },
};
