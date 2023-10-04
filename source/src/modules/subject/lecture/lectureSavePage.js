import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from '../routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import LectureForm from './lectureForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
const message = defineMessages({
    objectName: 'Bài giảng',
    subject: 'Môn học',
    lecture: 'Bài giảng',
    home: 'Trang chủ',
});

const LectureSavePage = () => {
    const translate = useTranslate();
    const lectureId = useParams();
    const queryParameters = new URLSearchParams(window.location.search);
    const totalLecture = queryParameters.get('totalLecture');
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.lecture.getById,
            create: apiConfig.lecture.create,
            update: apiConfig.lecture.update,
        },
        options: {
            getListUrl: generatePath(routes.lectureListPage.path, { subjectId: lectureId.subjectId }),
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                console.log(data);
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    ordering: totalLecture,
                };
            };
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.subject) },
                {
                    breadcrumbName: translate.formatMessage(message.lecture),
                    path: routes.subjectListPage.path + `/lecture/${lectureId.subjectId}`,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <LectureForm
                subjectId={lectureId.subjectId}
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
export default LectureSavePage;
