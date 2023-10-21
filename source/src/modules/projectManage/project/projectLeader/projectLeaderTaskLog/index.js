
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
    return (
        <ProjectTaskLogListPage breadcrumbName={breadcrumbName}/>
    );
}

export default ProjectLeaderTaskLogListPage;
