import React from 'react';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import routes from '@routes';
import LectureListPage from '@modules/course/lecture';
import { useParams } from 'react-router-dom';

const message = defineMessages({
    objectName: 'Task',
    home: 'Trang chủ',
    task: 'Task',
    course: 'Khóa học',
    lecture: 'Bài giảng',
});
const AsignAllListPage = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseName = queryParameters.get('courseName');
    const subjectId = queryParameters.get('subjectId');
    const paramid = useParams();
    const setBreadRoutes = () => {
        const breadRoutes = [{ breadcrumbName: translate.formatMessage(message.home) }];
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(message.course),
            path: routes.courseLeaderListPage.path,
        });
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(message.task),
            path: routes.courseLeaderListPage.path + `/task/${paramid.courseId}?courseName=${courseName}&subjectId=${subjectId}`,
        });
        breadRoutes.push({ breadcrumbName: translate.formatMessage(message.lecture) });

        return breadRoutes;
    };
    return (
        <LectureListPage breadcrumbName={setBreadRoutes}/>
    );
};

export default AsignAllListPage;
