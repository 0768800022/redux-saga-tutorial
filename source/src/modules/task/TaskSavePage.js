import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { categoryKind } from '@constants/masterData';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import routes from '@routes';
import TaskForm from './TaskForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    objectName: 'Task',
    home: 'Trang chủ',
    task: 'Task',
    course: 'Khóa học',
});

function TaskSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const taskId = useParams();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.task.getById,
            create: apiConfig.task.create,
            update: apiConfig.task.update,
        },
        options: {
            getListUrl: generatePath(routes.taskListPage.path, { taskId }),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    status: 1,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                { breadcrumbName: translate.formatMessage(messages.course), path: routes.courseListPage.path },
                {
                    breadcrumbName: translate.formatMessage(messages.task),
                    path: routes.taskListPage.path + `?courseId=${courseId}&courseName=${courseName}`,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <TaskForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
}

export default TaskSavePage;
