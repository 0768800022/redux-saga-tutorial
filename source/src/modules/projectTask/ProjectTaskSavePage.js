import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { categoryKind } from '@constants/masterData';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import routes from './routes';
import ProjectTaskForm from './ProjectTaskForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import route1 from '@modules/project/routes';

const messages = defineMessages({
    objectName: 'Task',
    home: 'Trang chủ',
    ProjectTask: 'Task',
    project: 'Dự án',
});

function ProjectTaskSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const projectTaskId = useParams();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.projectTask.getById,
            create: apiConfig.projectTask.create,
            update: apiConfig.projectTask.update,
        },
        options: {
            getListUrl: generatePath(routes.ProjectTaskListPage.path, { projectTaskId }),
            objectName: translate.formatMessage(messages.objectName),
        },
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
                    projectId: projectId,
                };
            };
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                { 
                    breadcrumbName: translate.formatMessage(messages.project),
                    path: route1.projectListPage.path,
                },
                {
                    breadcrumbName: translate.formatMessage(messages.ProjectTask),
                    path: routes.ProjectTaskListPage.path + `?projectId=${projectId}&projectName=${projectName}`,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <ProjectTaskForm
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

export default ProjectTaskSavePage;
