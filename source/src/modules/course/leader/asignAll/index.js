import React from 'react';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import routes from '@routes';
import LectureListPage from '@modules/course/lecture';
import { useParams } from 'react-router-dom';
import { commonMessage } from '@locales/intl';

const AsignAllListPage = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseName = queryParameters.get('courseName');
    const subjectId = queryParameters.get('subjectId');
    const paramid = useParams();
    const setBreadRoutes = () => {
        const breadRoutes = [];
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.course),
            path: routes.courseLeaderListPage.path,
        });
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.task),
            path: routes.courseLeaderListPage.path + `/task/${paramid.courseId}?courseName=${courseName}&subjectId=${subjectId}`,
        });
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.lecture) });

        return breadRoutes;
    };
    return (
        <LectureListPage breadcrumbName={setBreadRoutes}/>
    );
};

export default AsignAllListPage;
