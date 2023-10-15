import React from 'react';
import { generatePath, useLocation, useParams } from 'react-router-dom';
import routes from '@routes';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import TaskSavePage from '@modules/task/TaskSavePage';
import { commonMessage } from '@locales/intl';

const messages = defineMessages({
    objectName: 'Task',
});

function TaskLeaderSavePage() {
    const translate = useTranslate();
    const location =useLocation();
    const state = location.state.prevPath;
    const search = location.search;
    const paramHead = routes.courseLeaderListPage.path;
    const paramid = useParams();
    const courseId = paramid.courseId;
    const breadcrumbName= routes.taskSavePage.breadcrumbs(messages,paramHead,state,search);
    const getListUrl = generatePath(routes.taskLeaderListPage.path, { courseId });
    return (
        <TaskSavePage getListUrl={getListUrl} breadcrumbName={breadcrumbName}/>
    );
}

export default TaskLeaderSavePage;
