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
import { showErrorMessage } from '@services/notifyService';

const message = defineMessages({
    objectName: 'Dự án',
    student: 'Dự án',
    registration: 'Danh sách sinh viên đăng kí khóa học',

});

const RegistrationProjectSavePage = () => {
    const studentId = useParams();
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const stuId = queryParameters.get('studentId');
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseState = queryParameters.get('courseState');
    const courseStatus = queryParameters.get('courseStatus');
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
            funcs.onSaveError = (err) => {
                if (err.response.data.code === 'ERROR-REGISTRATION-PROJECT-ERROR-0000') {
                    showErrorMessage('Dự án đăng ký đã tồn tại!');
                    mixinFuncs.setSubmit(false);
                } else {
                    mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                    mixinFuncs.setSubmit(false);
                }
            };
        },
    });
    const setBreadRoutes = () => {
        const pathDefault = `?studentId=${stuId}&studentName=${studentName}`;
        const pathDefault2 = `?studentId=${stuId}&studentName=${studentName}&registrationId=${registrationId}&courseName=${courseName}`;

        const pathCourse1 = `?courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`;
        const pathCourse2 = `?registrationId=${registrationId}&courseName=${courseName}&courseId=${courseId}&courseState=${courseState}&courseStatus=${courseStatus}`;

        const breadRoutes = [];
        if (courseId != 'null') {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.course),
                path: '/course',
            });
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.registration),
                path: routes.registrationListPage.path + pathCourse1,
            });
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.registrationProject),
                path: routes.courseRegistrationProjectListPage.path + pathCourse2,
            });
        } else {
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
        }
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
                developerId={stuId}
            />
        </PageWrapper>
    );
};
export default RegistrationProjectSavePage;
