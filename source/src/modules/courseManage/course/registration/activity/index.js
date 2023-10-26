import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { TaskLogKindOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag } from 'antd';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import { FieldTypes } from '@constants/formConfig';
import useFetch from '@hooks/useFetch';
import styles from '../Registration.module.scss';
import useAuth from '@hooks/useAuth';
const message = defineMessages({
    objectName: 'Hoạt động của tôi',
    reminderMessage: 'Vui lòng chọn khoá học !',
    registration: 'Danh sách sinh viên đăng kí khóa học',
});

function StudentActivityCourseListPage() {
    const translate = useTranslate();
    const location = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const studentId = queryParameters.get('studentId');
    const studentName = queryParameters.get('studentName');
    const KindTaskLog = translate.formatKeys(TaskLogKindOptions, ['label']);
    const { profile } = useAuth();
    const pathPrev = localStorage.getItem('pathPrev');
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.taskLog,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params, studentId, courseId, studentName: null });
            };
        },
    });

    const columns = [
        {
            title: translate.formatMessage(commonMessage.message),
            dataIndex: 'message',
        },
        {
            title: translate.formatMessage(commonMessage.totalTime),
            dataIndex: 'totalTime',
            align: 'center',
            width: 150,
            render(totalTime) {
                return <div>{Math.ceil((totalTime / 60) * 10) / 10} h</div>;
            },
        },
        {
            title: 'Loại',
            dataIndex: 'kind',
            align: 'center',
            width: 120,
            render(dataRow) {
                const kindLog = KindTaskLog.find((item) => item.value == dataRow);
                return (
                    <Tag color={kindLog.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{kindLog.label}</div>
                    </Tag>
                );
            },
        },
    ].filter(Boolean);
    const { data: timeSum } = useFetch(apiConfig.taskLog.getSum, {
        immediate: true,
        params: { courseId, studentId },
        mappingData: ({ data }) => data.content,
    });

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.course),
                    path: routes.courseListPage.path,
                },
                {
                    breadcrumbName: translate.formatMessage(message.registration),
                    path: routes.registrationListPage.path + pathPrev,
                },
                { breadcrumbName: translate.formatMessage(commonMessage.studentActivity) },
            ]}
        >
            <ListPage
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                        <span style={{ fontWeight: 'normal' }}>{studentName}</span>
                        <span style={{ fontWeight: 'normal', fontSize: '14px' }}>
                            {timeSum && timeSum[0]?.timeWorking
                                ? Math.ceil((timeSum[0]?.timeWorking / 60) * 10) / 10
                                : 0}
                            h | {translate.formatMessage(commonMessage.totalTimeOff)}:{' '}
                            {timeSum && timeSum[0]?.timeOff ? Math.ceil((timeSum[0]?.timeOff / 60) * 10) / 10 : 0}h
                        </span>
                    </div>
                }
                baseTable={
                    <div>
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                        />
                    </div>
                }
            />
        </PageWrapper>
    );
}

export default StudentActivityCourseListPage;
