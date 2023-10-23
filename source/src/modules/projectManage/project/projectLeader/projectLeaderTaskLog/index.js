
import routes from '@routes';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { commonMessage } from '@locales/intl';
import ProjectTaskLogListPage from '@modules/projectManage/project/projectTask/projectTaskLog';

function ProjectLeaderTaskLogListPage() {
    const location = useLocation();
    const taskParam = routes.projectLeaderTaskListPage.path;
    const search = location.search;
    const paramHead = routes.projectLeaderListPage.path;
    const breadcrumbName= routes.taskLogListPage.breadcrumbs(commonMessage,paramHead,taskParam,search);
    const renderAction = false;
    const createPermission = false;
    return (
        <ProjectTaskLogListPage breadcrumbName={breadcrumbName} renderAction = {renderAction} createPermission = {createPermission}/>
    );
}

export default ProjectLeaderTaskLogListPage;
