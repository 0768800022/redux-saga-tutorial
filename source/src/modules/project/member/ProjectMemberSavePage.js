import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { categoryKind } from '@constants/masterData';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import routes from '../routes';
import ProjectMemberForm from './ProjectMemberForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
// import routes from '@modules/course/routes';

const messages = defineMessages({
    objectName: 'Danh sách thành viên tham gia',
    home: 'Trang chủ',
    project: 'Dự án',
    member: 'Danh sách thành viên tham gia',
});

function ProjectMemberSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);

    const projectId = queryParameters.get('projectId');
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.memberProject.getById,
            create: apiConfig.memberProject.create,
            update: apiConfig.memberProject.update,
        },
        options: {
            getListUrl: routes.projectMemberListPage.path,
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    id: detail.id,
                    schedule: data.schedule,
                    status: 1,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    projectId: projectId,
                    developerId: data.developer.studentInfo.fullName,
                    projectRoleId: data.projectRole.projectRoleName,
                };
            };
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                { breadcrumbName: translate.formatMessage(messages.project) },
                {
                    breadcrumbName: translate.formatMessage(messages.member),
                    path: routes.projectMemberListPage.path,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <ProjectMemberForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                isError={errors}
            />
        </PageWrapper>
    );
}

export default ProjectMemberSavePage;
