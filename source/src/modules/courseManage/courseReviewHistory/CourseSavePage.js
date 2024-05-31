import PageWrapper from '@components/common/layout/PageWrapper';
import { STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import CourseDetailForm from './CourseForm';
import routes from '@routes';
import { defineMessages } from 'react-intl';
const messages = defineMessages({
    objectName: 'Khoá học chờ xét duyệt',
    viewCourse:'Xem chi tiết khoá học',
});
const CourseReviewHistoryListSavePage = () => {
    const translate = useTranslate();
    const { id } = useParams();

    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.courseReviewHistory.getById,
            // update: apiConfig.course.update,
            // create: apiConfig.course.create,
        },
        options: {
            getListUrl: routes.courseReviewHistoryListPage.path,
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    status: STATUS_ACTIVE,
                    avatarPath: data.avatar,
                    id: id,
                    ...data,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    status: STATUS_ACTIVE,
                };
            };

            funcs.mappingData = (data) => {
                return {
                    ...data.data,
                };
            };
        },
    });


    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(messages.objectName),
                    path: routes.courseReviewHistoryListPage.path,
                },
                { breadcrumbName: translate.formatMessage(messages.viewCourse) },
            ]}
        >
            <CourseDetailForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                // formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={true}
                onSubmit={onSave}
            />
        </PageWrapper>
    );
};

export default CourseReviewHistoryListSavePage;
