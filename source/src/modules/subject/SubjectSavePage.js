import PageWrapper from '@components/common/layout/PageWrapper';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import SubjectForm from './SubjectForm';
import { generatePath, useParams } from 'react-router-dom';
import routes from './routes';

const messages = defineMessages({
    home: 'Home',
    subject: 'Subject',
    objectName: 'subject',
});

const SubjectSavePage = () => {
    const subjectId = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {},
        options: {
            getListUrl: generatePath(routes.subjectListPage.path, { subjectId }),
            objectName: translate.formatMessage(messages.objectName),
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                {
                    breadcrumbName: translate.formatMessage(messages.subject),
                    path: generatePath(routes.subjectListPage.path, { subjectId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <SubjectForm
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

export default SubjectSavePage;
