import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import CourseForm from './CourseForm';
import routes from './routes';
import { generatePath, useParams } from 'react-router-dom';

const messages = defineMessages({
    home: 'Home',
    objectName: 'course',
    course: 'Course',
});

const CourseSavePage = () => {
    const courseId = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {},
        options: {
            getListUrl: generatePath(routes.courseListPage.path, { courseId }),
            objectName: translate.formatMessage(messages.objectName),
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                {
                    breadcrumbName: translate.formatMessage(messages.course),
                    path: generatePath(routes.courseListPage.path, { courseId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CourseForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};

export default CourseSavePage;
