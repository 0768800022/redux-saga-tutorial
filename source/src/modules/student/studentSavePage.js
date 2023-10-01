import React from 'react';
import routes from './routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import StudentForm from './studentForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
const message = defineMessages({
    objectName:'student',
    home:'Home',
    student: 'Student',
});

const StudentSavePage = () => {
    const translate = useTranslate();
    
    const { detail, onSave, mixinFuncs,setIsChangedFormValues,isEditing,errors, loading, title } = useSaveBase({

    });
    return(
        <PageWrapper
            loading = {loading}
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.student),path: routes.studentListPage.path },
                { breadcrumbName: title },
            ]}
        >
            <StudentForm
                formId={mixinFuncs.getFormId()}
                actions = {mixinFuncs.renderActions()}
                dataDetail = {detail ? detail : {}}
                onSubmit = {onSave}
                setIsChangedFormValues = {setIsChangedFormValues}
                isError = {errors}
                isEditing = {isEditing}
            />
        </PageWrapper>
    );
};
export default StudentSavePage;