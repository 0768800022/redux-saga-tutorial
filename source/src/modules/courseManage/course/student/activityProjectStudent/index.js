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
import styles from './activityProjectStudent.module.scss';
import useAuth from '@hooks/useAuth';
const message = defineMessages({
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

    const columns = [
        {
            title: translate.formatMessage(commonMessage.message),
            dataIndex: 'message',
        },
        {
            title: translate.formatMessage(message.gitCommitUrl),
            dataIndex: 'gitCommitUrl',
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
            placeholder: translate.formatMessage(commonMessage.project),
            type: FieldTypes.SELECT,
            onChange: (value) => {
                value ? setIsHasValueSearch(true) : setIsHasValueSearch(false);
            },
            options: myProject,
        },
    ];

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
                            <div style={{ color: 'red' }}>{translate.formatMessage(message.reminderMessage)}</div>
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
