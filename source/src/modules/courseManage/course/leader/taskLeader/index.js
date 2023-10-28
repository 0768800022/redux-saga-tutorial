import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE, DEFAULT_FORMAT } from '@constants';
import apiConfig from '@constants/apiConfig';
import { taskState } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag, Modal } from 'antd';
import React, { useState } from 'react';
import { useLocation, useParams, useNavigate, generatePath } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import { useIntl } from 'react-intl';
import { commonMessage } from '@locales/intl';
import { CalendarOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { FieldTypes } from '@constants/formConfig';
import styles from '../../course.module.scss';

const message = defineMessages({
    objectName: 'Task',
    updateSuccess: 'Cập nhật {objectName} thành công',
    updateTaskSuccess: 'Cập nhật tình trạng thành công',
    done: 'Hoàn thành',
});

function TaskListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const notification = useNotification();
    const intl = useIntl();
    const navigate = useNavigate();

    const queryParameters = new URLSearchParams(window.location.search);
    const courseName = queryParameters.get('courseName');
    const subjectId = queryParameters.get('subjectId');
    const state = queryParameters.get('state');
    const paramid = useParams();
    const courseId = paramid.courseId;
    const [detail, setDetail] = useState();
    const statusValues = translate.formatKeys(taskState, ['label']);
    const [openedStateTaskModal, handlersStateTaskModal] = useDisclosure(false);
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
                return (
                    routes.courseLeaderListPage.path +
                    `/task/${paramid.courseId}/lecture?courseId=${paramid.courseId}&courseName=${courseName}&subjectId=${subjectId}`
                );
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?courseName=${courseName}&subjectId=${subjectId}`;
            };
            funcs.additionalActionColumnButtons = () => ({
                state: (item) => (
                    <BaseTooltip title={translate.formatMessage(message.done)}>
                        <Button
                            type="link"
                            disabled={item.state === 2}
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setDetail(item);
                                handlersStateTaskModal.open();
                            }}
                        >
                            <CheckOutlined />
                        </Button>
                    </BaseTooltip>
                ),
                taskLog: ({ id, lecture, state, status, name }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.taskLog)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    generatePath(routes.taskLeaderListPage.path, { courseId }) +
                                        `/task-log?courseName=${courseName}&taskId=${id}&taskName=${lecture.lectureName}&subjectId=${subjectId}`,
                                    {
                                        state: { action: 'taskLog', prevPath: location.pathname },
                                    },
                                );
                            }}
                        >
                            <CalendarOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params });
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
        columns.push(
            mixinFuncs.renderActionColumn({ taskLog: true, state: true, edit: true, delete: true }, { width: '150px' }),
        );
        return columns;
    };

    const { data: memberCourse } = useFetch(apiConfig.task.autocomplete, {
        immediate: true,
        params: { courseId: courseId },
        mappingData: ({ data }) =>
            data.content
                .map((item) => ({
                    value: item?.student?.id,
                    label: item?.student?.fullName,
                }))
                .filter((item, index, self) => {
                    // Lọc ra các phần tử duy nhất bằng cách so sánh value
                    return index === self.findIndex((t) => t.value === item.value);
                }),
    });

    const searchFields = [
        {
            key: 'studentId',
            placeholder: <FormattedMessage defaultMessage={'Sinh viên'} />,
            type: FieldTypes.SELECT,
            options: memberCourse,
        },
    ].filter(Boolean);

    const { execute: executeUpdate } = useFetch(apiConfig.task.updateState, { immediate: false });
    const handleOk = () => {
        handlersStateTaskModal.close();
        updateState(detail);
    };
    const updateState = (values) => {
        executeUpdate({
            data: {
                taskId: values.id,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    mixinFuncs.getList();
                    notification({
                        message: intl.formatMessage(message.updateTaskSuccess),
                    });
                    handlersStateTaskModal.close();
                }
            },
            onError: (err) => {},
        });
    };

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.course),
                    path: routes.courseLeaderListPage.path,
                },
                { breadcrumbName: translate.formatMessage(commonMessage.task) },
            ]}
        >
            <div>
                <ListPage
                    title={<span style={{ fontWeight: 'normal' }}>{courseName}</span>}
                    actionBar={state != 3 ? mixinFuncs.renderActionBar() : ''}
                    searchForm={mixinFuncs.renderSearchForm({
                        fields: searchFields,
                        className: styles.search,
                    })}
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
                <Modal
                    title="Thay đổi tình trạng hoàn thành"
                    open={openedStateTaskModal}
                    onOk={handleOk}
                    onCancel={() => handlersStateTaskModal.close()}
                    data={detail || {}}
                ></Modal>
            </div>
        </PageWrapper>
    );
}

export default TaskListPage;
