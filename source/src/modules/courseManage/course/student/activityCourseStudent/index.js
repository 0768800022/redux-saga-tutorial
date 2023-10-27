import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { TaskLogKindOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import { FieldTypes } from '@constants/formConfig';
import useFetch from '@hooks/useFetch';
import styles from './activityCourseStudent.module.scss';
import useAuth from '@hooks/useAuth';
const message = defineMessages({
    selectCourse: 'Chọn khoá học',
    objectName: 'Nhật ký',
    reminderMessage: 'Vui lòng chọn khoá học !',
});

function MyActivityCourseListPage() {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const KindTaskLog = translate.formatKeys(TaskLogKindOptions, ['label']);
    const [isHasValueSearch, setIsHasValueSearch] = useState(courseId && true);
    const { profile } = useAuth();
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
                mixinFuncs.handleFetchList({ ...params, studentId: profile.id });
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?courseId=${courseId}&taskId=${dataRow?.task?.id}&taskName=${dataRow?.task?.lecture?.lectureName}`;
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
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ].filter(Boolean);
    const { data: myCourse } = useFetch(apiConfig.course.getListStudentCourse, {
        immediate: true,
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.id,
                label: item.name,
            })),
    });
    const searchFields = [
        {
            key: 'courseId',
            placeholder: translate.formatMessage(message.selectCourse),
            type: FieldTypes.SELECT,
            onChange: (value) => {
                value ? setIsHasValueSearch(true) : setIsHasValueSearch(false);
            },
            options: myCourse,
        },
    ];
    const { data: timeSum, execute: executeTimeSum } = useFetch(apiConfig.taskLog.getSum, {
        immediate: false,
        params: { courseId: queryFilter?.courseId, studentId: profile.id },
        mappingData: ({ data }) => data.content,
    });
    useEffect(() => {
        executeTimeSum({
            params: { courseId, studentId: profile.id },
        });
    }, [courseId]);
    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.myActivity) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    className: !isHasValueSearch && styles.disableSearch,
                    initialValues: queryFilter,
                    onReset: () => setIsHasValueSearch(false),
                })}
                baseTable={
                    <div>
                        {!courseId && !isHasValueSearch && (
                            <div style={{ color: 'red', position: 'relative', padding: '12px 0' }}>
                                <span style={{ position: 'absolute', top: '-9px', left: '3px' }}>
                                    {translate.formatMessage(message.reminderMessage)}
                                </span>
                            </div>
                        )}
                        {courseId && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                    {translate.formatMessage(commonMessage.totalTimeWorking)}:{' '}
                                    {timeSum && timeSum[0]?.timeWorking
                                        ? Math.ceil((timeSum[0]?.timeWorking / 60) * 10) / 10
                                        : 0}
                                    h | {translate.formatMessage(commonMessage.totalTimeOff)}:{' '}
                                    {timeSum && timeSum[0]?.timeOff
                                        ? Math.ceil((timeSum[0]?.timeOff / 60) * 10) / 10
                                        : 0}
                                    h
                                </span>
                            </div>
                        )}
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={courseId && !loading && data}
                            columns={columns}
                        />
                    </div>
                }
            />
        </PageWrapper>
    );
}

export default MyActivityCourseListPage;
