import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from './routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import CourseForm from './courseForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
const message = defineMessages({
    objectName:'Khóa học',
    course: 'Khóa học',
});

const CourseSavePage = () => {
    const courseId = useParams();
    const translate = useTranslate();
    
    const { detail, onSave, mixinFuncs,setIsChangedFormValues,isEditing,errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.course.getById,
            create: apiConfig.course.create,
            update: apiConfig.course.update,
        },
        options:{
            getListUrl: routes.courseListPage.path,
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
                };
            };
        },

    });
    return(
        <PageWrapper
            loading = {loading}
            routes={[
                { breadcrumbName: translate.formatMessage(message.course),
                    // path: generatePath(routes.courseStudentListPage.path, { courseId } ) },
                    path: generatePath(routes.courseListPage.path, { courseId } ) },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CourseForm
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
export default CourseSavePage;