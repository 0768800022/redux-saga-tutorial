
import routes from '@routes';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { commonMessage } from '@locales/intl';
import ProjectTaskLogListPage from '@modules/projectManage/project/projectTask/projectTaskLog';

function ProjectStudentTaskLogListPage() {
    const location = useLocation();
    const taskParam = routes.projectStudentTaskListPage.path;
    const search = location.search;
    const paramHead = routes.projectStudentListPage.path;
    const isProject = true;
    const breadcrumbName= routes.taskLogListPage.breadcrumbs(commonMessage,paramHead,taskParam,search,isProject);
    const renderAction = true;
    const createPermission = true;
    return (
        <ProjectTaskLogListPage breadcrumbName={breadcrumbName} renderAction = {renderAction} createPermission = {createPermission}/>
    );
}

export default ProjectStudentTaskLogListPage;
