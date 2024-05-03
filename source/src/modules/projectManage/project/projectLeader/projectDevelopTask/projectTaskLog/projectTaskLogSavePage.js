import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { categoryKind } from '@constants/masterData';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useLocation, useParams, useNavigate } from 'react-router-dom';
import routes from '@routes';
import ProjectTaskLogForm from './projectTaskLogForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';


const messages = defineMessages({
    objectName: 'Nhật ký',
});

function ProjectTaskLogSavePage({ getListUrl, breadcrumbName }) {
    const translate = useTranslate();
    const location = useLocation();
    const state = location.state.prevPath;
    const search = location.search;
    const paramHead = routes.projectListPage.path;
    const taskLogParam = routes.ProjectTaskLogListPage.path;
    const taskLogId = useParams();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const storyName = queryParameters.get('storyName');
    const storyId = queryParameters.get('storyId');
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.projectTaskLog.getById,
            create: apiConfig.projectTaskLog.create,
            update: apiConfig.projectTaskLog.update,
        },
        options: {
            getListUrl: generatePath(routes.projectDevelopTaskLog.path),
            objectName: translate.formatMessage(messages.objectName),
        },
        isProjectToken : true,
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    status: 1,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },
    });

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.project),
            path: routes.projectLeaderListPage.path,
        },
        {
            breadcrumbName: translate.formatMessage(commonMessage.generalManage),
            path:
                routes.projectDeveloperTabPage.path +
                `?projectId=${projectId}&projectName=${projectName}&active=${active}`,
        },
        {
            breadcrumbName: storyName,
            path:
                routes.projectDevelopTask.path +
                `?projectId=${projectId}&projectName=${projectName}&active=${active}&storyId=${storyId}&storyName=${storyName}`,
        },
        {
            breadcrumbName: title,
        },
    ];

    return (
        <PageWrapper
            loading={loading}
            routes={breadcrumbs}
        >
            <ProjectTaskLogForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
}

export default ProjectTaskLogSavePage;
