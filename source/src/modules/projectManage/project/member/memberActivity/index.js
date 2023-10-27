import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { TaskLogKindOptions, archivedOption } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { Button, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import style from '../member.module.scss';
import { IconAlarm, IconAlarmOff } from '@tabler/icons-react';
import { ReloadOutlined } from '@ant-design/icons';
import { showSucsessMessage } from '@services/notifyService';
import { FormattedMessage } from 'react-intl';
import { FieldTypes } from '@constants/formConfig';
import styles from '@modules/projectManage/project/project.module.scss';

const message = defineMessages({
    objectName: 'Hoạt động của tôi',
    reminderMessage: 'Vui lòng chọn dự án !',
    gitCommitUrl: 'Đường dẫn commit git',
    title: 'Bạn có xác nhận đặt lại thời gian?',
    ok: 'Đồng ý',
    cancel: 'Huỷ',
    resetSuccess: 'Đặt lại thời gian thành công!',
    reset: 'Đặt lại thời gian thành công',
});

function MemberActivityProjectListPage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const studentId = queryParameters.get('studentId');
    const studentName = queryParameters.get('studentName');
    const notification = useNotification();
    const KindTaskLog = translate.formatKeys(TaskLogKindOptions, ['label']);
    const archivedOptions = translate.formatKeys(archivedOption, ['label']);
    const pathPrev = localStorage.getItem('pathPrev');
    const { execute } = useFetch(apiConfig.projectTaskLog.archiveAll);
    const [valueSearch, setValueSearch] = useState(null);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } = useListBase({
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
            funcs.changeFilter = (filter) => {
                const projectId = queryParams.get('projectId');
                const studentId = queryParams.get('studentId');
                const studentName = queryParams.get('studentName');
                mixinFuncs.setQueryParams(serializeParams({ projectId, studentId, studentName, ...filter }));
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
    const { data: timeSum, execute: executeGetTime } = useFetch(apiConfig.projectTaskLog.getSum, {
        immediate: true,
        params: { projectId, studentId },
        mappingData: ({ data }) => data.content,
    });

    useEffect(() => { executeGetTime({ params: { archived: valueSearch, projectId, studentId } }); }, [valueSearch]);

    const searchFields = [
        {
            key: 'archived',
            placeholder: <FormattedMessage defaultMessage={"Archived"} />,
            type: FieldTypes.SELECT,
            onChange: (value) => {
                setValueSearch(value);
            },
            options: archivedOptions,
        },
    ].filter(Boolean);

    const handleAchiveAll = () => {
        Modal.confirm({
            title: translate.formatMessage(message.title),
            content: '',
            okText: translate.formatMessage(message.ok),
            cancelText: translate.formatMessage(message.cancel),
            onOk: () => {
                execute({
                    data: { projectId, devId: studentId },
                    onCompleted: () => {
                        showSucsessMessage(translate.formatMessage(message.reset));
                        executeGetTime();
                    },
                });
            },
        });
    };
    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.project),
                    path: routes.projectListPage.path,
                },
                {
                    breadcrumbName: translate.formatMessage(commonMessage.member),
                    path: routes.projectMemberListPage.path + pathPrev,
                },
                { breadcrumbName: translate.formatMessage(commonMessage.memberActivity) },
            ]}
        >
            <ListPage
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                        <span style={{ fontWeight: 'normal' }}>{studentName}</span>
                        <span>
                            {mixinFuncs.hasPermission(apiConfig.projectTaskLog.archiveAll.baseURL) && (
                                <Button onClick={handleAchiveAll} style={{ marginRight: '1rem' }}>
                                    <BaseTooltip title={translate.formatMessage(message.reset)}>
                                        <ReloadOutlined />
                                    </BaseTooltip>
                                </Button>
                            )}

                            <span>
                                <IconAlarm style={{ marginBottom: '-5px' }} />:{' '}
                                <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                    {timeSum ? Math.ceil((timeSum[0]?.totalTimeWorking / 60) * 10) / 10 : 0}h |{' '}
                                </span>
                            </span>
                            <span>
                                <IconAlarmOff style={{ marginBottom: '-5px', color: 'red' }} />:{' '}
                                <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                    {timeSum ? Math.ceil((timeSum[0]?.totalTimeOff / 60) * 10) / 10 : 0}h
                                </span>
                            </span>
                        </span>
                    </div>
                }
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    className: styles.search,
                })}
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

export default MemberActivityProjectListPage;
