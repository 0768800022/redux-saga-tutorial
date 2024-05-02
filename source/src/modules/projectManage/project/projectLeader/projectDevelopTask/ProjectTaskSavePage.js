import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { showErrorMessage } from '@services/notifyService';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useParams } from 'react-router-dom';
import ProjectTaskForm from './ProjectTaskForm';

const messages = defineMessages({
    objectName: 'Task',
});

function ProjectTaskSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const storyId = queryParameters.get('storyId');
    const storyName = queryParameters.get('storyName');
    const projectTaskId = useParams();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.projectTask.getById,
            create: apiConfig.projectTask.create,
            update: apiConfig.projectTask.update,
        },
        options: {
            getListUrl: generatePath(routes.projectDevelopTask.path),
            objectName: translate.formatMessage(messages.objectName),
        },
        isProjectToken : true,
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    projectId: projectId,
                    storyId:storyId,
                    status: 1,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    projectId: projectId,
                    storyId:storyId,
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
    // const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
    //     apiConfig: {
    //         getById: apiConfig.projectTask.getById,
    //         create: apiConfig.projectTask.create,
    //         update: apiConfig.projectTask.update,
    //     },
    //     options: {
    //         getListUrl: generatePath(
    //             routes.ProjectTaskListPage.path,
    //             active ? { projectId, projectName, active } : { projectId, projectName },
    //         ),
    //         objectName: translate.formatMessage(messages.objectName),
    //     },
    //     override: (funcs) => {
    //         funcs.prepareUpdateData = (data) => {
    //             return {
    //                 ...data,
    //                 id: detail.id,
    //                 status: 1,
    //                 storyId: storyId,
    //             };
    //         };
    //         funcs.prepareCreateData = (data) => {
    //             return {
    //                 ...data,
    //                 projectId: projectId,
    //                 storyId: storyId,
    //             };
    //         };
    //         funcs.onSaveError = (err) => {
    //             if (err.code === 'ERROR-PROJECT-ERROR-0001') {
    //                 showErrorMessage('Dự án đã hoàn thành không thể tạo thêm task');
    //                 mixinFuncs.setSubmit(false);
    //             } else {
    //                 mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
    //                 mixinFuncs.setSubmit(false);
    //             }
    //         };
    //     },
    // });
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
                path: routes.projectDeveloperTabPage.path+`?projectId=${projectId}&storyId=${storyId}&active=${active}&projectName=${projectName}`,
            },
            {
                breadcrumbName: storyName,
                path: routes.projectDevelopTask.path+`?projectId=${projectId}&storyId=${storyId}&active=${active}&projectName=${projectName}&storyName=${storyName}`,
            });
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.generalManage),
                path: routes.projectDeveloperTabPage.path+`?projectId=${projectId}&storyId=${storyId}&projectName=${projectName}`,
            },
            {
                breadcrumbName: storyName,
                path: routes.projectDevelopTask.path+`?projectId=${projectId}&storyId=${storyId}&active=${active}&projectName=${projectName}&storyName=${storyName}`,
            });
        }
        breadRoutes.push({ breadcrumbName: title });

        return breadRoutes;
    };
    return (
        <PageWrapper loading={loading} routes={setBreadRoutes()} title={title}>
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
