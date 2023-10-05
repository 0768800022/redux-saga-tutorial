import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { categoryKind } from '@constants/masterData';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import routes from './routes';
import RegistrationForm from './RegistrationForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    objectName: 'Danh sách khóa học',
    home: 'Trang chủ',
    registration: 'Danh sách sinh viên đăng kí khóa học',
});

function RegistrationSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.registration.getById,
            create: apiConfig.registration.create,
            update: apiConfig.registration.update,
        },
        options: {
            getListUrl: routes.registrationListPage.path,
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    status: 1,
                    isIssuedCertify: 1,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    courseId: courseId,
                    isIssuedCertify: 1,
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
                    breadcrumbName: courseName,
                    path: routes.registrationListPage.path,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <RegistrationForm
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

export default RegistrationSavePage;
