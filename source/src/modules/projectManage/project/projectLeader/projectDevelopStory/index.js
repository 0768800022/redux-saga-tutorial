import { CalendarOutlined, CheckOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import {
    DATE_FORMAT_END_OF_DAY_TIME,
    DATE_FORMAT_ZERO_TIME,
    DEFAULT_TABLE_ITEM_SIZE,
    storageKeys,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { projectTaskState, statusOptions } from '@constants/masterData';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import styles from '@modules/projectManage/project/project.module.scss';
import routes from '@routes';
import { Button, Col, Modal, Row } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { BaseForm } from '@components/common/form/BaseForm';
import NumericField from '@components/common/form/NumericField';
import TextField from '@components/common/form/TextField';
import { DATE_FORMAT_DISPLAY, DEFAULT_FORMAT } from '@constants';
import { showErrorMessage } from '@services/notifyService';
import { convertUtcToLocalTime, formatDateString } from '@utils';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { getData } from '@utils/localStorage';
import dayjs from 'dayjs';
import DetailMyTaskProjectModal from '../../projectStudent/myTask/DetailMyTaskProjectModal';

const message = defineMessages({
    objectName: 'Task',
    developer: 'Lập trình viên',
    home: 'Trang chủ',
    state: 'Tình trạng',
    projectTask: 'Task',
    project: 'Dự án',
    leader: 'Leader',
    name: 'Tên task',
    status: 'Trạng thái',
    startDate: 'Ngày bắt đầu',
    updateTaskSuccess: 'Cập nhật tình trạng thành công',
    done: 'Hoàn thành',
    cancel: 'Huỷ',
});

function ProjectLeaderTaskListPage() {
    const translate = useTranslate();
    const navigate = useNavigate();
    const intl = useIntl();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const [introduceData, setIntroduceData] = useState({});
    const [openedModal, handlersModal] = useDisclosure(false);

    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const leaderId = queryParameters.get('leaderId');
    const leaderName = queryParameters.get('leaderName');
    const developerName = queryParameters.get('developerName');
    const active = queryParameters.get('active');
    const state = queryParameters.get('state');
    const notification = useNotification({ duration: 3 });
    const [openedStateTaskModal, handlersStateTaskModal] = useDisclosure(false);

    const [openedIntroduceModal, handlersIntroduceModal] = useDisclosure(false);
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const location = useLocation();
    const [detail, setDetail] = useState();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
   
    const { execute: executeGet, loading: loadingDetail } = useFetch(
        { ...apiConfig.projectTask.getById, authorization: `Bearer ${userTokenProject}` },
        {
            immediate: false,
        },
    );
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.story,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            isProjectToken : true,
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    if (response.result === true) {
                        return {
                            data: response?.data?.content,
                            total: response?.data?.totalElements,
                        };
                    }
                };
                funcs.getCreateLink = () => {
                    return `${pagePath}/story/create?projectId=${projectId}&projectName=${projectName}&active=${active}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/story/${dataRow.id}?projectId=${projectId}&projectName=${projectName}&active=${active}`;
                };

                funcs.changeFilter = (filter) => {
                    const projectId = queryParams.get('projectId');
                    const projectName = queryParams.get('projectName');
                    const developerName = queryParams.get('developerName');
                    const leaderName = queryParams.get('leaderName');
                    const active = queryParams.get('active');
                    let filterAdd;
                    if (developerName) {
                        filterAdd = { developerName };
                    } else if (leaderName) {
                        filterAdd = { leaderName };
                    }
                    if (filterAdd) {
                        mixinFuncs.setQueryParams(
                            serializeParams({
                                active,
                                projectId: projectId,
                                projectName: projectName,
                                ...filterAdd,
                                ...filter,
                            }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(
                            serializeParams({ projectId: projectId, projectName: projectName, active, ...filter }),
                        );
                    }
                };

                funcs.additionalActionColumnButtons = () => ({
                    taskLog: ({ id, taskName }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.taskLog)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.projectLeaderTaskListPage.path +
                                            `/task-log?projectId=${projectId}&projectName=${projectName}&projectTaskId=${id}&task=${taskName}&active=${active}`,
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
                        <BaseTooltip title={translate.formatMessage(message.done)}>
                            <Button
                                type="link"
                                disabled={item.state === 3}
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
    const handleFetchDetail = (id) => {
        executeGet({
            pathParams: { id: id },
            onCompleted: (response) => {
                setDetail(response.data);
            },
            onError: mixinFuncs.handleGetDetailError,
        });
    };
    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };
    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên story" />,
            width: 200,
            dataIndex: 'storyName',
        },
        // {
        //     title: <FormattedMessage defaultMessage="Người thực hiện" />,
        //     width: 200,
        //     dataIndex: ['developerInfo','account','fullName'],
        //     render: (_, record) => record?.developerInfo?.account?.fullName || record?.leader?.leaderName,
        // },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            width: 200,
            align: 'right',
        },
        {
            title: 'Ngày hoàn thành',
            dataIndex: 'dateComplete',
            width: 180,
            render: (dateComplete) => {
                const modifiedDateComplete = convertStringToDateTime(dateComplete, DEFAULT_FORMAT, DEFAULT_FORMAT)?.add(
                    7,
                    'hour',
                );
                const modifiedDateCompleteTimeString = convertDateTimeToString(modifiedDateComplete, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateCompleteTimeString}</div>;
            },
            align: 'right',
        },

        mixinFuncs.renderStatusColumn({ width: '120px' }),

        // active &&
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '180px' }),
    ].filter(Boolean);
    const params = mixinFuncs.prepareGetListParams(queryFilter);
    const userTokenProject = getData(storageKeys.USER_PROJECT_ACCESS_TOKEN);
    const { execute: executeUpdateStateValue } = useFetch(
        { ...apiConfig.projectTask.changeState, authorization: `Bearer1231212 ${userTokenProject}` },
        { immediate: false },
    );

    
    const updateState = (values) => {
        executeUpdateStateValue({
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
                showErrorMessage('error');
            },
        });
    };

    const handleOnClick = (event, record) => {
        event.preventDefault();
        localStorage.setItem(routes.projectTabPage.keyActiveTab, translate.formatMessage(commonMessage.task));
        navigate(
            routes.projectDevelopTask.path +
                `?projectId=${projectId}&storyId=${record.id}&storyName=${record?.storyName}&active=${!!record.status == 1}&projectName=${projectName}`,
        );
    };

    return (
        <div>
            <ListPage
                title={<span style={{ fontWeight: 'normal', fontSize: '16px' }}>{projectName}</span>}
                // searchForm={mixinFuncs.renderSearchForm({
                //     fields: searchFields,
                //     className: styles.search,
                //     initialValues: initialFilterValues,
                // })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onRow={(record) => ({
                            onClick: (e) => {
                                e.stopPropagation();
                                handleOnClick(e, record);
                                // handleFetchDetail(record.id);
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
            <DetailMyTaskProjectModal open={openedModal} onCancel={() => handlersModal.close()} DetailData={detail} />
            <Modal
                title="Thay đổi tình trạng hoàn thành"
                open={openedStateTaskModal}
                destroyOnClose={true}
                footer={null}
                onCancel={() => handlersStateTaskModal.close()}
                data={detail || {}}
            >
                <BaseForm onFinish={updateState} size="100%">
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
                                    addonAfter={<FormattedMessage defaultMessage="Phút" />}
                                    min={0}
                                    required
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
        </div>
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
export default ProjectLeaderTaskListPage;
