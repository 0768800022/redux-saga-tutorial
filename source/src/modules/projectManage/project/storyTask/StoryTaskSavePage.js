import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { categoryKind } from '@constants/masterData';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import routes from '@routes';
import StoryTaskForm from './StoryTaskForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';

const messages = defineMessages({
    objectName: 'Story',
});

function StoryTaskSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    let projectIdInt = parseInt(projectId);
    const projectTaskId = useParams();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.story.getById,
            create: apiConfig.story.create,
            update: apiConfig.story.update,
        },
        options: {
            getListUrl: generatePath(
                routes.projectTabPage.path,
                active ? { projectId, projectName, active } : { projectId, projectName },
            ),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    projectId: projectIdInt,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    projectId: projectId,
                };
            };
            funcs.onSaveError = (err) => {
                if (err.code === 'ERROR-PROJECT-ERROR-0001') {
                    showErrorMessage('Dự án đã hoàn thành không thể tạo thêm story');
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
                path: routes.projectListPage.path,
            },
        ];

        if (active) {
            breadRoutes.push({
                breadcrumbName: projectName,
                path:
                    routes.projectTabPage.path + `?projectId=${projectId}&projectName=${projectName}&active=${active}`,
            });
        } else {
            breadRoutes.push({
                breadcrumbName: projectName,
                path: routes.projectTabPage.path + `?projectId=${projectId}&projectName=${projectName}`,
            });
        }
        breadRoutes.push({ breadcrumbName: title });

        return breadRoutes;
    };
    return (
        <PageWrapper loading={loading} routes={setBreadRoutes()} title={title}>
            <StoryTaskForm
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

export default StoryTaskSavePage;
