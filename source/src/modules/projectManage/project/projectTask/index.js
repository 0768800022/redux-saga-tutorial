import { CalendarOutlined, CheckOutlined, BugOutlined } from '@ant-design/icons';
import { BaseForm } from '@components/common/form/BaseForm';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import NumericField from '@components/common/form/NumericField';
import TextField from '@components/common/form/TextField';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import {
    DATE_FORMAT_DISPLAY,
    DATE_FORMAT_END_OF_DAY_TIME,
    DATE_FORMAT_ZERO_TIME,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
    TASK_KIND_BUG,
    TASK_KIND_FEATURE,
    TASK_KIND_TESTCASE,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { projectTaskKind, projectTaskKind_1, projectTaskState } from '@constants/masterData';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { convertUtcToLocalTime, formatDateString, orderNumber } from '@utils';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { Button, Col, Modal, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import bug from '../../../../assets/images/bug.jpg';
import feature from '../../../../assets/images/feature.png';
import styles from '../project.module.scss';
import DetailMyTaskProjectModal from '../projectStudent/myTask/DetailMyTaskProjectModal';
import PageWrapper from '@components/common/layout/PageWrapper';
import { showErrorMessage } from '@services/notifyService';
import testCase from '../../../../assets/icons/testCase.svg';

const message = defineMessages({
    objectName: 'Task',
    cancel: 'Huỷ',
    done: 'Hoàn thành',
    updateTaskSuccess: 'Cập nhật tình trạng thành công',
    updateTaskError: 'Cập nhật tình trạng thất bại',
});

function ProjectTaskListPage({ setSearchFilter }) {
    const translate = useTranslate();
    const navigate = useNavigate();
    const notification = useNotification({ duration: 3 });
    const intl = useIntl();

    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const storyName = queryParameters.get('storyName');
    const storyId = queryParameters.get('storyId');
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const kindValues = translate.formatKeys(projectTaskKind_1, ['label']);

    const location = useLocation();
    const activeProjectTab = localStorage.getItem('activeProjectTab');
    localStorage.setItem('pathPrev', location.search);
    const [openedModal, handlersModal] = useDisclosure(false);
    const [detail, setDetail] = useState({});
    const [openedStateTaskModal, handlersStateTaskModal] = useDisclosure(false);

    const { execute: executeGet } = useFetch(apiConfig.projectTask.getById, {
        immediate: false,
    });
    const handleFetchDetail = (id) => {
        executeGet({
            pathParams: { id: id },
            onCompleted: (response) => {
                setDetail(response.data);
            },
        });
    };
    const { execute: executeUpdate } = useFetch(apiConfig.projectTask.changeState, { immediate: false });

    const handleOk = (values) => {
        handlersStateTaskModal.close();
        updateState(values);
    };
    const updateState = (values) => {
        executeUpdate({
            data: {
                id: detail.id,
                state: 3,
                minutes: values.minutes,
                message: values.message,
                gitCommitUrl: values.gitCommitUrl,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    handlersStateTaskModal.close();
                    mixinFuncs.getList();
                    notification({
                        message: intl.formatMessage(message.updateTaskSuccess),
                    });
                }
            },
            onError: (err) => {
                showErrorMessage(intl.formatMessage(message.updateTaskError));
            },
        });
    };
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.projectTask,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(commonMessage.task),

            },
            // tabOptions:{
            //     queryPage: {
            //         projectId,
            //         storyId,
            //     },
            //     isTab: true,
            // },
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
                    return `${routes.ProjectTaskListPage.path}/create?projectId=${projectId}&storyId=${storyId}&storyName=${storyName}&active=${active}&projectName=${projectName}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${routes.ProjectTaskListPage.path}/${dataRow.id}?projectId=${projectId}&storyId=${storyId}&storyName=${storyName}&active=${active}&projectName=${projectName}`;
                };
                funcs.additionalActionColumnButtons = () => ({
                    bug: ({ id, taskName, kind }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.createBug)}>
                            <Button
                                disabled={kind === 2 || kind === 3}
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.ProjectTaskListPage.path +
                                            `/create?projectId=${projectId}&storyId=${storyId}&storyName=${storyName}&active=${active}&projectName=${projectName}&isTaskBug=${true}`,
                                        {
                                            state: { action: 'projectTaskLog', prevPath: location.pathname },
                                        },
                                    );
                                }}
                            >
                                <BugOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    taskLog: ({ id, taskName }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.taskLog)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.ProjectTaskListPage.path +
                                            `/task-log?projectId=${projectId}&projectName=${projectName}&projectTaskId=${id}&task=${taskName}&active=${active}&storyName=${storyName}&storyId=${storyId}`,
                                        {
                                            state: { action: 'projectTaskLog', prevPath: location.pathname },
                                        },
                                    );
                                }}
                            >
                                <CalendarOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    state: (item) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.done)}>
                            <Button
                                type="link"
                                disabled={!!item?.developer == false || item.state === 3}
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
                });
                funcs.getList = () => {
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({ ...params, projectId, storyId });
                };
                funcs.changeFilter = (filter) => {
                    const projectId = queryParams.get('projectId');
                    const storyId = queryParams.get('storyId');
                    const projectName = queryParams.get('projectName');
                    const storyName = queryParams.get('storyName');
                    const active = queryParams.get('active');

                    mixinFuncs.setQueryParams(serializeParams({ projectId,active,projectName, storyId, storyName, ...filter }));
                };
                const handleFilterSearchChange = funcs.handleFilterSearchChange;

                funcs.handleFilterSearchChange = (values) => {
                    if (values.toDate == null && values.fromDate == null) {
                        delete values.toDate;
                        delete values.fromDate;
                        handleFilterSearchChange({
                            ...values,
                        });
                    } else if (values.toDate == null) {
                        const fromDate = values.fromDate && formatDateToZeroTime(values.fromDate);
                        delete values.toDate;
                        handleFilterSearchChange({
                            ...values,
                            fromDate: fromDate,
                        });
                    } else if (values.fromDate == null) {
                        const toDate = values.toDate && formatDateToEndOfDayTime(values.toDate);
                        delete values.fromDate;
                        handleFilterSearchChange({
                            ...values,
                            toDate: toDate,
                        });
                    } else {
                        const fromDate = values.fromDate && formatDateToZeroTime(values.fromDate);
                        const toDate = values.toDate && formatDateToEndOfDayTime(values.toDate);
                        handleFilterSearchChange({
                            ...values,
                            fromDate: fromDate,
                            toDate: toDate,
                        });
                    }
                };
            },
        });
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'id',
            render: (text, record, index) => {
                return orderNumber(pagination,index);
            },
            width: 50,
        },
        {
            dataIndex: 'kind',
            width: 15,
            render(dataRow) {
                if (dataRow === TASK_KIND_FEATURE)
                    return (
                        <div>
                            <img src={feature} height="30px" width="30px" />
                        </div>
                    );
                if (dataRow === TASK_KIND_BUG)
                    return (
                        <div>
                            <img src={bug} height="30px" width="30px" />
                        </div>
                    );
                if (dataRow === TASK_KIND_TESTCASE)
                    return (
                        <div>
                            <img src={testCase} height="30px" width="30px" />
                        </div>
                    );
            },
        },
        {
            title: translate.formatMessage(commonMessage.task),
            width: 200,
            dataIndex: 'taskName',
        },
        {
            title: translate.formatMessage(commonMessage.developer),
            dataIndex: ['developer', 'account', 'fullName'],
            width: 200,
            render: (_, record) => record?.developer?.account?.fullName || record?.leader?.leaderName,
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            width: 200,
            align: 'right',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'dueDate',
            width: 200,
            align: 'right',

        },
        {
            title: 'Tình trạng',
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues?.find((item) => item?.value == dataRow);
                return (
                    <Tag color={state?.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state?.label}</div>
                    </Tag>
                );
            },
        },

        active &&
            mixinFuncs.renderActionColumn({ bug: mixinFuncs.hasPermission([apiConfig.task.create?.baseURL]), state: true, edit: true, delete: true }, { width: '180px' }),
    ].filter(Boolean);

    const { data: memberProject } = useFetch(apiConfig.memberProject.autocomplete, {
        immediate: true,
        params: { projectId: projectId },
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item?.developer?.id,
                label: item?.developer?.account?.fullName,
            })),
    });

    const searchFields = [
        // {
        //     key: 'projectCategoryId',
        //     placeholder: <FormattedMessage defaultMessage={'Danh mục'} />,
        //     type: FieldTypes.AUTOCOMPLETE,
        //     apiConfig: apiConfig.projectCategory.autocomplete,
        //     mappingOptions: (item) => ({
        //         value: item.id,
        //         label: item.projectCategoryName,
        //     }),
        //     optionsParams: { projectId: projectId },
        //     initialSearchParams: { projectId: projectId },
        //     searchParams: (text) => ({ name: text }),
        // },
        {
            key: 'developerId',
            placeholder: <FormattedMessage defaultMessage={'Lập trình viên'} />,
            type: FieldTypes.SELECT,
            options: memberProject,
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
        },
        {
            key: 'kind',
            placeholder: translate.formatMessage(commonMessage.kind),
            type: FieldTypes.SELECT,
            options: kindValues,
        },
        // {
        //     key: 'fromDate',
        //     type: FieldTypes.DATE,
        //     format: DATE_FORMAT_DISPLAY,
        //     placeholder: translate.formatMessage(commonMessage.fromDate),
        //     colSpan: 3,
        // },
        // {
        //     key: 'toDate',
        //     type: FieldTypes.DATE,
        //     format: DATE_FORMAT_DISPLAY,
        //     placeholder: translate.formatMessage(commonMessage.toDate),
        //     colSpan: 3,
        // },
    ].filter(Boolean);
    const initialFilterValues = useMemo(() => {
        const initialFilterValues = {
            ...queryFilter,
            fromDate: queryFilter.fromDate && dayjs(formatDateToLocal(queryFilter.fromDate), DEFAULT_FORMAT),
            toDate:
                queryFilter.toDate && dayjs(formatDateToLocal(queryFilter.toDate), DEFAULT_FORMAT).subtract(7, 'hour'),
        };

        return initialFilterValues;
    }, [queryFilter?.fromDate, queryFilter?.toDate]);

    // useEffect(() => {
    //     setSearchFilter(queryFilter);
    // }, [queryFilter]);

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.project),
            path: routes.projectListPage.path,
        },
        {
            breadcrumbName: projectName,
            path: routes.projectTabPage.path+`?projectId=${projectId}&storyId=${storyId}&active=${active}&projectName=${projectName}`,
        },
        {
            breadcrumbName: `Story (${storyName})`,
        },
    ];

    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    className: styles.search,
                    activeTab: activeProjectTab,
                    initialFilterValues:initialFilterValues,
                })}
                actionBar={active && mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onRow={(record) => ({
                            onClick: (e) => {
                                e.stopPropagation();
                                handleFetchDetail(record.id);

                                handlersModal.open();
                            },
                        })}
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                }
            />
            <Modal
                title="Thay đổi tình trạng hoàn thành"
                open={openedStateTaskModal}
                destroyOnClose={true}
                footer={null}
                onCancel={() => handlersStateTaskModal.close()}
                data={detail || {}}
            >
                <BaseForm onFinish={handleOk} size="100%">
                    <div
                        style={{
                            margin: '28px 0 20px 0',
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <NumericField
                                    label={<FormattedMessage defaultMessage="Tổng thời gian" />}
                                    name="minutes"
                                    required
                                    addonAfter={<FormattedMessage defaultMessage="Phút" />}
                                    min={0}
                                />
                            </Col>
                            <Col span={24}>
                                <TextField
                                    label={<FormattedMessage defaultMessage="Đường dẫn commit git" />}
                                    name="gitCommitUrl"
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <TextField
                                    label={<FormattedMessage defaultMessage="Lời nhắn" />}
                                    name="message"
                                    type="textarea"
                                    required
                                />
                            </Col>
                        </Row>
                        <div style={{ float: 'right' }}>
                            <Button className={styles.btnModal} onClick={() => handlersStateTaskModal.close()}>
                                {translate.formatMessage(message.cancel)}
                            </Button>
                            <Button key="submit" type="primary" htmlType="submit" style={{ marginLeft: '8px' }}>
                                {translate.formatMessage(message.done)}
                            </Button>
                        </div>
                    </div>
                </BaseForm>
            </Modal>
            <DetailMyTaskProjectModal open={openedModal} onCancel={() => handlersModal.close()} DetailData={detail} />
        </PageWrapper>
    );
}
const formatDateToZeroTime = (date) => {
    const dateString = formatDateString(date, DEFAULT_FORMAT);
    return dayjs(dateString, DEFAULT_FORMAT).format(DATE_FORMAT_ZERO_TIME);
};
const formatDateToEndOfDayTime = (date) => {
    const dateString = formatDateString(date, DEFAULT_FORMAT);
    return dayjs(dateString, DEFAULT_FORMAT).format(DATE_FORMAT_END_OF_DAY_TIME);
};

const formatDateToLocal = (date) => {
    return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
};
export default ProjectTaskListPage;
