import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    DEFAULT_TABLE_ITEM_SIZE,
    DEFAULT_FORMAT,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { taskState } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import {  Tag } from 'antd';
import React from 'react';
import { useLocation,useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { commonMessage } from '@locales/intl';

const message = defineMessages({
    objectName: 'Task',
});

function TaskListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseName = queryParameters.get('courseName');
    const subjectId = queryParameters.get('subjectId');
    const state = queryParameters.get('state');
    const paramid = useParams();
    const statusValues = translate.formatKeys(taskState, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            getList: apiConfig.task.courseTask,
            delete: apiConfig.task.delete,
            update: apiConfig.task.update,
            getById: apiConfig.task.getById,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareGetListPathParams = () => {
                return {
                    courseId: paramid.courseId,
                };
            };
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
                return routes.courseLeaderListPage.path + `/task/${paramid.courseId}/lecture?courseId=${paramid.courseId}&courseName=${courseName}&subjectId=${subjectId}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?courseName=${courseName}&subjectId=${subjectId}`;
            };
        },
    });

    const setColumns = () => {
        const columns = [
            {
                title: translate.formatMessage(commonMessage.task),
                dataIndex: ['lecture', 'lectureName'],
            },
            {
                title: translate.formatMessage(commonMessage.studentName),
                dataIndex: ['student', 'fullName'],
            },
            {
                title: 'Ngày bắt đầu',
                dataIndex: 'startDate',
                width: 180,
                render: (startDate) => {
                    const modifiedstartDate = convertStringToDateTime(startDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                    const modifiedstartDateTimeString = convertDateTimeToString(modifiedstartDate, DEFAULT_FORMAT);
                    return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedstartDateTimeString}</div>;
                },
                align: 'center',
            },
            {
                title: 'Ngày kết thúc',
                dataIndex: 'dueDate',
                width: 180,
                render: (dueDate) => {
                    const modifieddueDate = convertStringToDateTime(dueDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                    const modifieddueDateTimeString = convertDateTimeToString(modifieddueDate, DEFAULT_FORMAT);
                    return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifieddueDateTimeString}</div>;
                },
                align: 'center',
            },
            {
                title: translate.formatMessage(commonMessage.state),
                dataIndex: 'state',
                align: 'center',
                width: 120,
                render(dataRow) {
                    const state = statusValues.find((item) => item.value == dataRow);
                    return (
                        <Tag color={state.color}>
                            <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                        </Tag>
                    );
                },
            },
        ];
        columns.push(mixinFuncs.renderActionColumn({ edit: true, delete: false }, { width: '120px' }));
        return columns;
    };


    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.course), path: routes.courseLeaderListPage.path },
                { breadcrumbName: translate.formatMessage(commonMessage.task) },
            ]}
        >
            <div>
                <ListPage
                    title={
                        <span
                            style={
                                state != 2 ? { fontWeight: 'normal' } : { fontWeight: 'normal', position: 'absolute' }
                            }
                        >
                            {courseName}
                        </span>
                    }
                    actionBar={mixinFuncs.renderActionBar()}

                    baseTable={
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={setColumns()}
                        />
                    }
                />
            </div>
        </PageWrapper>
    );
}

export default TaskListPage;
