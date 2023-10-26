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
import useAuth from '@hooks/useAuth';
import useNotification from '@hooks/useNotification';
import style from '../projectLeaderMember.module.scss';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
const message = defineMessages({
    objectName: 'Hoạt động của tôi',
    reminderMessage: 'Vui lòng chọn dự án !',
    gitCommitUrl: 'Đường dẫn commit git',
});

function MemberActivityProjectLeaderListPage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const studentId = queryParameters.get('studentId');
    const studentName = queryParameters.get('studentName');
    const notification = useNotification();
    const KindTaskLog = translate.formatKeys(TaskLogKindOptions, ['label']);
    const pathPrev = localStorage.getItem('pathPrev');
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
                mixinFuncs.handleFetchList({ ...params, studentId, projectId, studentName: null });
            };
        },
    });
    const handleOnClickReview = (url) => {
        const pattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
        if (pattern.test(url)) {
            window.location.href = url;
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
                    <div className={style.customDiv} onClick={() => handleOnClickReview(gitUrl)}>
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
    const { data: timeSum } = useFetch(apiConfig.projectTaskLog.getSum, {
        immediate: true,
        params: { projectId, studentId },
        mappingData: ({ data }) => data.content,
    });

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.project),
                    path: routes.projectLeaderListPage.path,
                },
                {
                    breadcrumbName: translate.formatMessage(commonMessage.member),
                    path: routes.projectLeaderMemberListPage.path + pathPrev,
                },
                { breadcrumbName: translate.formatMessage(commonMessage.memberActivity) },
            ]}
        >
            <ListPage
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                        <span style={{ fontWeight: 'normal' }}>{studentName}</span>
                        <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                            {translate.formatMessage(commonMessage.totalTimeWorking)}:{' '}
                            {timeSum ? Math.ceil((timeSum[0]?.totalTimeWorking / 60) * 10) / 10 : 0}h |{' '}
                            {translate.formatMessage(commonMessage.totalTimeOff)}:{' '}
                            {timeSum ? Math.ceil((timeSum[0]?.totalTimeOff / 60) * 10) / 10 : 0}h
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

export default MemberActivityProjectLeaderListPage;
