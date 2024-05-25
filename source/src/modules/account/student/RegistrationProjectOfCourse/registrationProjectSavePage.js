import React from 'react';
import apiConfig from '@constants/apiConfig';
import PageWrapper from '@components/common/layout/PageWrapper';
import StudentForm from './registrationProjectForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import routes from '@routes';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import RegistrationProjectForm from './registrationProjectForm';
import { commonMessage } from '@locales/intl';

const message = defineMessages({
    objectName: 'Dự án',
    student: 'Dự án',
});

const RegistrationProjectSavePage = () => {
    const studentId = useParams();
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const stuId = queryParameters.get('studentId');
    const courseName = queryParameters.get('courseName');
    const studentName = queryParameters.get('studentName');
    const registrationId = queryParameters.get('registrationId');
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.registrationProject.getById,
            create: apiConfig.registrationProject.create,
            update: apiConfig.registrationProject.update,
        },
        options: {
            getListUrl: routes.studentCourseRegistrationProjectListPage.path,
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
                    registrationId: registrationId,
                };
            };
        },
    });
    const setBreadRoutes = () => {
        const pathDefault = `?studentId=${stuId}&studentName=${studentName}`;
        const pathDefault2 = `?studentId=${stuId}&studentName=${studentName}&registrationId=${registrationId}&courseName=${courseName}`;

        const breadRoutes = [];
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.student),
            path: routes.studentListPage.path,
        });
        breadRoutes.push({
            breadcrumbName: courseName,
            path: routes.studentCourseListPage.path + pathDefault,
        });
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.registrationProject),
            path: routes.studentCourseRegistrationProjectListPage.path + pathDefault2,
        });
        breadRoutes.push({
            breadcrumbName: title,
        });
        return breadRoutes;
    };
    return (
        <PageWrapper loading={loading} routes={setBreadRoutes()} title={title}>
            <RegistrationProjectForm
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail ? detail : {}}
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
            />
        </PageWrapper>
    );
};
export default RegistrationProjectSavePage;
