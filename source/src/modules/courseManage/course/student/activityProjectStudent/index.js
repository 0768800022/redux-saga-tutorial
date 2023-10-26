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
import styles from './activityProjectStudent.module.scss';
import useAuth from '@hooks/useAuth';
import useNotification from '@hooks/useNotification';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
const message = defineMessages({
    selectProject: 'Chọn dự án',
    objectName: 'Hoạt động của tôi',
    reminderMessage: 'Vui lòng chọn dự án !',
    gitCommitUrl: 'Đường dẫn commit git',
});

function MyActivityProjectListPage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const KindTaskLog = translate.formatKeys(TaskLogKindOptions, ['label']);
    const [isHasValueSearch, setIsHasValueSearch] = useState(projectId && true);
    const { profile } = useAuth();
    const notification = useNotification();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.projectTaskLog,
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
        },
    });
    const handleOnClickReview = (url) => {
        const pattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
        if (pattern.test(url)) {
            window.open(url, '_blank');
        } else {
            notification({
                type: 'warning',
                message: translate.formatMessage(commonMessage.warningUrl),
            });
        }
    };

    const columns = [
        {
            title: translate.formatMessage(commonMessage.message),
            dataIndex: 'message',
        },
        {
            title: translate.formatMessage(message.gitCommitUrl),
            dataIndex: 'gitCommitUrl',
            render: (gitUrl) => {
                return (
                    <div className={styles.customDiv} onClick={() => handleOnClickReview(gitUrl)}>
                        <BaseTooltip title={gitUrl}>Review</BaseTooltip>
                    </div>
                );
            },
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
    const { data: myProject } = useFetch(apiConfig.project.getListStudent, {
        immediate: true,
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.id,
                label: item.name,
            })),
    });
    const searchFields = [
        {
            key: 'projectId',
            placeholder: translate.formatMessage(message.selectProject),
            type: FieldTypes.SELECT,
            onChange: (value) => {
                value ? setIsHasValueSearch(true) : setIsHasValueSearch(false);
            },
            options: myProject,
        },
    ];
    const { data: timeSum, execute: executeTimeSum } = useFetch(apiConfig.projectTaskLog.getSum, {
        immediate: false,
        params: { projectId: queryFilter?.projectId, studentId: profile.id },
        mappingData: ({ data }) => data.content,
    });
    useEffect(() => {
        executeTimeSum({
            params: { projectId, studentId: profile.id },
        });
    }, [projectId]);
    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.myActivity) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    className: !isHasValueSearch && styles.disableSearch,
                    onReset: () => setIsHasValueSearch(false),
                })}
                baseTable={
                    <div>
                        {!projectId && !isHasValueSearch && (
                            <div style={{ color: 'red', position: 'relative', padding: '12px 0' }}>
                                <span style={{ position: 'absolute', top: '-9px', left: '3px' }}>
                                    {translate.formatMessage(message.reminderMessage)}
                                </span>
                            </div>
                        )}
                        {projectId && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end' }}>
                                <span style={{ fontWeight: 'normal', fontSize: '14px' }}>
                                    {translate.formatMessage(commonMessage.totalTimeWorking)}:{' '}
                                    {timeSum ? Math.ceil((timeSum[0]?.totalTimeWorking / 60) * 10) / 10 : 0}h |{' '}
                                    {translate.formatMessage(commonMessage.totalTimeOff)}:{' '}
                                    {timeSum ? Math.ceil((timeSum[0]?.totalTimeOff / 60) * 10) / 10 : 0}h
                                </span>
                            </div>
                        )}
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={projectId && !loading && data}
                            columns={columns}
                        />
                    </div>
                }
            />
        </PageWrapper>
    );
}

export default MyActivityProjectListPage;
