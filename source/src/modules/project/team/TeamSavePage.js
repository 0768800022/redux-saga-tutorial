import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from '@routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import TeamForm from './TeamForm';
import ProjectTaskForm from '@modules/projectTask/ProjectTaskForm';
const message = defineMessages({
    objectName: 'Team',
    home: 'Trang chủ',
    team: 'Nhóm',
    project: 'Dự án',
});

// const TeamSavePage = () => {
function TeamSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const active = queryParameters.get('active');
    // const projectName = queryParameters.get('projectName');
    const teamId = useParams();
    // console.log(projectId);
    console.log("projectId " + projectId);
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.team.getById,
            create: apiConfig.team.create,
            update: apiConfig.team.update,
        },
        options: {
            getListUrl: generatePath(routes.teamListPage.path, { teamId }),
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
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
    const setBreadRoutes = () => {
        const breadRoutes = [
            { breadcrumbName: translate.formatMessage(message.home) },
            {
                breadcrumbName: translate.formatMessage(message.project),
                path: routes.projectListPage.path,
            },
        ];

        if (active) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.team),
                path: routes.teamListPage.path + `?active=${active}`,
            });
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.team),
                path: routes.teamListPage.path,
            });
        }
        breadRoutes.push({ breadcrumbName: title });

        return breadRoutes;
    };
    return (
        <PageWrapper
            loading={loading}
            routes={setBreadRoutes()}
            title={title}
        >
            <TeamForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
                projectId={projectId}
            />
        </PageWrapper>
    );
}

export default TeamSavePage;
