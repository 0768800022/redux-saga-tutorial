import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import routes from '@routes';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';

import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
import { defineMessages } from 'react-intl';
import ProjectStoryTaskForm from './ProjectStoryTaskForm';

const messages = defineMessages({
    objectName: 'Task',
});

function ProjectStoryTaskSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const projectTaskId = useParams();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.story.getById,
            create: apiConfig.story.create,
            update: apiConfig.story.update,
        },
        options: {
            getListUrl: generatePath(routes.projectDeveloperTabPage.path),
            objectName: translate.formatMessage(messages.objectName),
        },
        isProjectToken : true,
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    projectId: projectId,
                    status: 1,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    projectId: projectId,
                    status: 1,
                };
            };
            funcs.onSaveError = (err) => {
                if (err.code === 'ERROR-PROJECT-ERROR-0001') {
                    showErrorMessage('Dự án đã hoàn thành không thể tạo thêm task');
                    mixinFuncs.setSubmit(false);
                } else {
                    mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                    mixinFuncs.setSubmit(false);
                }
            };
        },
    });
    const setBreadRoutes = () => {
        const breadRoutes = [
            {
                breadcrumbName: translate.formatMessage(commonMessage.project),
                path: routes.projectLeaderListPage.path,
            },
        ];

        if (active) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.generalManage),
                path:
                    routes.projectDeveloperTabPage.path + `?projectId=${projectId}&projectName=${projectName}&active=${active}`,
            });
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.generalManage),
                path: routes.projectDeveloperTabPage.path  + `?projectId=${projectId}&projectName=${projectName}`,
            });
        }
        breadRoutes.push({ breadcrumbName: title });

        return breadRoutes;
    };
    return (
        <PageWrapper loading={loading} routes={setBreadRoutes()} title={title}>
            <ProjectStoryTaskForm
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

export default ProjectStoryTaskSavePage;
