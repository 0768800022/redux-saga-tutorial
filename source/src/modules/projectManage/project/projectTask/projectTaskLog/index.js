import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE, DEFAULT_FORMAT } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag } from 'antd';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { commonMessage } from '@locales/intl';
import { TaskLogKindOptions } from '@constants/masterData';
import style from './projectTaskLog.module.scss';
import useNotification from '@hooks/useNotification';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { RightOutlined } from '@ant-design/icons';
import { convertUtcToLocalTime } from '@utils';
const message = defineMessages({
    objectName: 'Nhật ký',
    gitCommitUrl: 'Đường dẫn commit git',
    warningUrl: `Đường dẫn không hợp lệ !`,
});

function ProjectTaskLogListPage({ breadcrumbName, renderAction, createPermission }) {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const taskName = queryParameters.get('task');
    const projectName = queryParameters.get('projectName');

    const KindTaskLog = translate.formatKeys(TaskLogKindOptions, ['label']);
    const state = location?.state?.prevPath;
    const taskParam = routes.ProjectTaskListPage.path;
    const search = location.search;
    const notification = useNotification();
    const navigate = useNavigate();
    const paramHead = routes.projectListPage.path;
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
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
                funcs.getCreateLink = () => {
                    return `${pagePath}/create${search}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/${dataRow.id}${search}`;
                };
                funcs.getList = () => {
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({
                        ...params,
                        projectName: null,
                        taskName: null,
                        active: null,
                        task: null,
                    });
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
            title: translate.formatMessage(commonMessage.createdDate),
            width: 180,
            dataIndex: 'createdDate',
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.message),
            dataIndex: 'message',
        },
        {
            title: translate.formatMessage(message.gitCommitUrl),
            dataIndex: 'gitCommitUrl',
            render: (gitUrl) => {
                return (
                    gitUrl && (
                        <div className={style.customDiv} onClick={() => handleOnClickReview(gitUrl)}>
                            <BaseTooltip title={gitUrl}>Review</BaseTooltip>
                        </div>
                    )
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
        renderAction === false ? '' : mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ].filter(Boolean);
    return (
        <PageWrapper
            routes={
                breadcrumbName
                    ? breadcrumbName
                    : routes.ProjectTaskLogListPage.breadcrumbs(commonMessage, paramHead, taskParam, search)
            }
        >
            <div>
                <ListPage
                    title={
                        <span
                            style={{
                                fontWeight: 'normal',
                                fontSize: '16px',
                            }}
                        >
                            {projectName} <RightOutlined /> {taskName}
                        </span>
                    }
                    actionBar={mixinFuncs.renderActionBar()}
                    baseTable={
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                        />
                    }
                />
            </div>
        </PageWrapper>
    );
}
export default ProjectTaskLogListPage;
