import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    DEFAULT_TABLE_ITEM_SIZE,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { TaskLogKindOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag } from 'antd';
import React from 'react';
import { useLocation,generatePath,useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import TaskLogListPage from '@modules/task/taskLog';
const message = defineMessages({
    objectName: 'Task',
});

function TaskLogStudentListPage() {
    const location = useLocation();
    const paramid = useParams();
    const courseId = paramid.courseId;    
    const taskParam = generatePath(routes.taskStudentListPage.path, { courseId });
    const search = location.search;
    const paramHead = routes.courseStudentListPage.path;
    
    const breadcrumbName= routes.taskLogListPage.breadcrumbs(commonMessage,paramHead,taskParam,search);


    return (
        <TaskLogListPage breadcrumbName={breadcrumbName}/>
    );
}

export default TaskLogStudentListPage;
