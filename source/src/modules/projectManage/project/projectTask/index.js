import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { projectTaskKind, projectTaskState, statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag, Button, Modal, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { commonMessage } from '@locales/intl';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { CalendarOutlined, CheckOutlined } from '@ant-design/icons';
import styles from '../project.module.scss';
import useFetch from '@hooks/useFetch';
import DetailMyTaskProjectModal from '../projectStudent/myTask/DetailMyTaskProjectModal';
import useDisclosure from '@hooks/useDisclosure';
import useNotification from '@hooks/useNotification';
import { useIntl } from 'react-intl';
import TextField from '@components/common/form/TextField';
import NumericField from '@components/common/form/NumericField';
import { BaseForm } from '@components/common/form/BaseForm';
import feature from '../../../../assets/images/feature.png';
import bug from '../../../../assets/images/bug.jpg';

const message = defineMessages({
    objectName: 'Task',
    cancel: 'Huỷ',
    done: 'Hoàn thành',
    updateTaskSuccess: 'Cập nhật tình trạng thành công',
    updateTaskError: 'Cập nhật tình trạng thất bại',
});

function ProjectTaskListPage() {
    const translate = useTranslate();
    const navigate = useNavigate();
    const notification = useNotification({ duration: 3 });
    const intl = useIntl();

    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const leaderId = queryParameters.get('leaderId');
    const leaderName = queryParameters.get('leaderName');
    const developerName = queryParameters.get('developerName');
    const active = queryParameters.get('active');
    const state = queryParameters.get('state');
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const location = useLocation();
    localStorage.setItem('pathPrev', location.search);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [openedModal, handlersModal] = useDisclosure(false);
    const [detail, setDetail] = useState({});
    const [openedStateTaskModal, handlersStateTaskModal] = useDisclosure(false);

    const { execute: executeGet, loading: loadingDetail } = useFetch(apiConfig.projectTask.getById, {
        immediate: false,
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
                notification({
                    message: intl.formatMessage(message.updateTaskError),
                });
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
            override: (funcs) => {
                funcs.getList = () => {
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({ ...params, projectName: null, projectTaskId: null });
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
                    return `${pagePath}/create?projectId=${projectId}&projectName=${projectName}&active=${active}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/${dataRow.id}?projectId=${projectId}&projectName=${projectName}&active=${active}`;
                };
                funcs.changeFilter = (filter) => {
                    const projectId = queryParams.get('projectId');
                    const projectName = queryParams.get('projectName');
                    const developerName = queryParams.get('developerName');
                    const leaderName = queryParams.get('leaderName');
                    const leaderId = queryParams.get('leaderId');
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
                                projectId: projectId,
                                projectName: projectName,
                                ...filterAdd,
                                ...filter,
                            }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(
                            serializeParams({
                                projectId: projectId,
                                projectName: projectName,
                                leaderId,
                                active,
                                ...filter,
                            }),
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
                                        routes.ProjectTaskListPage.path +
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
                        <BaseTooltip title={translate.formatMessage(commonMessage.done)}>
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
            },
        });
    const columns = [
        {
            dataIndex: 'kind',
            width: 15,
            render(dataRow) {
                if (dataRow === 1)
                    return (
                        <div>
                            <img src={feature} height="30px" width="30px" />
                        </div>
                    );
                if (dataRow === 2)
                    return (
                        <div>
                            <img src={bug} height="30px" width="30px" />
                        </div>
                    );
            },
        },
        {
            title: translate.formatMessage(commonMessage.task),
            dataIndex: 'taskName',
        },
        {
            title: translate.formatMessage(commonMessage.developer),
            dataIndex: ['developer', 'studentInfo', 'fullName'],
        },
        {
            title: translate.formatMessage(commonMessage.projectCategory),
            dataIndex: ['projectCategoryInfo', 'projectCategoryName'],
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            width: 200,
            align: 'center',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'dueDate',
            width: 200,
        },
        {
            title: 'Tình trạng',
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },

        active &&
            mixinFuncs.renderActionColumn({ taskLog: true, state: true, edit: true, delete: true }, { width: '180px' }),
    ].filter(Boolean);

    const { data: memberProject } = useFetch(apiConfig.memberProject.autocomplete, {
        immediate: true,
        params: { projectId: projectId },
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item?.developer?.id,
                label: item?.developer?.studentInfo?.fullName,
            })),
    });
    const { data: projectCategory } = useFetch(apiConfig.projectCategory.autocomplete, {
        immediate: true,
        params: { projectId: projectId },
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item?.id,
                label: item?.projectCategoryName,
            })),
    });

    const searchFields = [
        {
            key: 'projectCategoryId',
            placeholder: translate.formatMessage(commonMessage.projectCategory),
            type: FieldTypes.SELECT,
            options: projectCategory,
        },
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
        // !leaderName &&
        //     !developerName && {
        //     key: 'status',
        //     placeholder: translate.formatMessage(commonMessage.status),
        //     type: FieldTypes.SELECT,
        //     options: statusValues,
        // },
    ].filter(Boolean);
    const pathPrev = localStorage.getItem('pathPrev');
    const setBreadRoutes = () => {
        const breadRoutes = [];
        if (leaderName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.leader),
                path: routes.leaderListPage.path,
            });
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.project),
                path: generatePath(routes.leaderProjectListPage.path + pathPrev),
            });
        } else if (developerName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.developer),
                path: routes.developerListPage.path,
            });
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.project),
                path: generatePath(routes.developerProjectListPage.path + pathPrev),
            });
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.project),
                path: generatePath(routes.projectListPage.path),
            });
        }
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.task) });

        return breadRoutes;
    };

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <div>
                <ListPage
                    title={<span style={{ fontWeight: 'normal', fontSize: '16px' }}>{projectName}</span>}
                    searchForm={mixinFuncs.renderSearchForm({
                        fields: searchFields,
                        className: styles.search,
                    })}
                    actionBar={active && !leaderName && !developerName && mixinFuncs.renderActionBar()}
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
            </div>
            <DetailMyTaskProjectModal open={openedModal} onCancel={() => handlersModal.close()} DetailData={detail} />
        </PageWrapper>
    );
}
export default ProjectTaskListPage;
