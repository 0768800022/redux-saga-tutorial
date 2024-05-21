import ListPage from '@components/common/layout/ListPage';
import React, { useEffect, useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    DEFAULT_FORMAT,
    DATE_FORMAT_DISPLAY,
    DEFAULT_TABLE_ITEM_SIZE,
    AppConstants,
    DATE_FORMAT_VALUE,
} from '@constants';
import { IconCategory, IconReportMoney } from '@tabler/icons-react';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { FormattedMessage, defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons';
import { Button, Avatar, Tag, Modal, Card, Row, Col, Form } from 'antd';
import { IconBrandTeams } from '@tabler/icons-react';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import routes from '@routes';
import route from '@modules/projectManage/project/projectTask/routes';
import { DollarOutlined, TeamOutlined, WomanOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { statusOptions, projectTaskState } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import styles from './project.module.scss';

// import icon_team_1 from '@assets/images/team-Members-Icon.png';

import useFetch from '@hooks/useFetch';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import useNotification from '@hooks/useNotification';
import { BaseForm } from '@components/common/form/BaseForm';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import NumericField from '@components/common/form/NumericField';
import TextField from '@components/common/form/TextField';
import useDisclosure from '@hooks/useDisclosure';
import DatePickerField from '@components/common/form/DatePickerField';
import { formatDateString } from '@utils';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
const message = defineMessages({
    objectName: 'Dự án',
});

const ProjectListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const leaderId = queryParameters.get('leaderId');
    const developerId = queryParameters.get('developerId');
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const leaderName = queryParameters.get('leaderName');
    const developerName = queryParameters.get('developerName');
    const [projectId, setProjectId] = useState();
    const [registerSalaryItem, setRegisterSalaryItem] = useState();

    localStorage.setItem('pathPrev', location.search);
    const [parentData, setParentData] = useState({});
    const notification = useNotification();
    const [hasError, setHasError] = useState(false);
    const [visible, setVisible] = useState(true);
    const [openModalSalaryPeriod, setOpenModalSalaryPeriod] = useState(false);
    // const [openModalCaculateSalary, setOpenModalCaculateSalary] = useState(false);
    const { data: salaryPeriodAutoComplete, execute: executeGetSalaryPeriod } = useFetch(
        apiConfig.salaryPeriod.autocomplete,
        { mappingData: (data) => data.data.content },
    );
    // const { execute: executeCalculateProjectSalary } = useFetch(apiConfig.income.calculateProjectSalary);
    const { execute: executeCalculateProjectSalary } = useFetch(apiConfig.registerSalaryPeriod.create);
    const { execute: executeUpdateCalculateProjectSalary } = useFetch(apiConfig.registerSalaryPeriod.update);

    const { data: isCheckExist } = useFetch(apiConfig.salaryPeriod.checkExist, {
        immediate: true,
        mappingData: ({ data }) => {
            return data;
        },
    });
    const [openedModalCaculateSalary, handlerModalCaculateSalary] = useDisclosure(false);
    const [openedModalUpdateCaculateSalary, handlerModalUpdateCaculateSalary] = useDisclosure(false);

    const [form] = Form.useForm();
    const handleFinish = (values) => {
        values.dueDate = values.dueDate && formatDateString(values.dueDate, DEFAULT_FORMAT);
        executeCalculateProjectSalary({
            data: { ...values },
            onCompleted: (response) => {
                handlerModalCaculateSalary.close();

                if (response?.result == true) {
                    showSucsessMessage(translate.formatMessage(commonMessage.registerPeriodSalarySuccess));
                    mixinFuncs.getList();
                }
            },
            onError: (error) => {
                handlerModalCaculateSalary.close();
                let errorCode = error.response.data.code;
                if (errorCode =='ERROR-REGISTER-SALARY-PERIOD-ERROR-0000') {
                    showErrorMessage(translate.formatMessage(commonMessage.registerPeriodSalaryFail));
                }
                else if (errorCode =='ERROR-SALARY-PERIOD-ERROR-0002') {
                    showErrorMessage(translate.formatMessage(commonMessage.registerPeriodSalaryFail_2));
                }
            },
        });
        form.resetFields();
    };

    const handleUpdate = (values) => {
        values.dueDate = values.dueDate && formatDateString(values.dueDate, DEFAULT_FORMAT);
        executeUpdateCalculateProjectSalary({
            data: { ...values },
            onCompleted: (response) => {
                handlerModalUpdateCaculateSalary.close();
                if (response?.result == true) {
                    showSucsessMessage(translate.formatMessage(commonMessage.registerPeriodSalarySuccess_1));
                    mixinFuncs.getList();
                }

            },
            onError: (error) => {
                handlerModalUpdateCaculateSalary.close();
                let errorCode = error.response.data.code;
                if (errorCode =='ERROR-REGISTER-SALARY-PERIOD-ERROR-0001') {
                    showErrorMessage(translate.formatMessage(commonMessage.registerPeriodSalaryFail_1));
                }
                else if (errorCode =='ERROR-SALARY-PERIOD-ERROR-0002') {
                    showErrorMessage(translate.formatMessage(commonMessage.registerPeriodSalaryFail_2));
                }
               
            },
        });
        form.resetFields();
    };
    const validateDueDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.project,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                };
                funcs.getItemDetailLink = (dataRow) => {
                    if (developerId)
                        return `${routes.projectListPage.path}/${dataRow.id}?developerId=${developerId}&developerName=${developerName}`;
                    else return `${routes.projectListPage.path}/${dataRow.id}`;
                };

                funcs.additionalActionColumnButtons = () => ({
                    salaryPeriod: ({ id }) => {
                        return (
                            <BaseTooltip title={translate.formatMessage(commonMessage.salaryPeriod)}>
                                <Button
                                    type="link"
                                    style={{ padding: 0 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        executeGetSalaryPeriod();
                                        setOpenModalSalaryPeriod(true);
                                    }}
                                >
                                    <DollarOutlined />
                                </Button>
                                <Modal
                                    open={openModalSalaryPeriod}
                                    footer={null}
                                    onCancel={() => {
                                        setOpenModalSalaryPeriod(false);
                                    }}
                                >
                                    <div style={{ marginTop: '30px' }}>
                                        <BaseTable
                                            columns={[
                                                {
                                                    title: translate.formatMessage(commonMessage.salaryPeriod),
                                                    dataIndex: 'name',
                                                    align: 'left',
                                                },
                                            ]}
                                            rowClassName={styles.clickRowTable}
                                            onRow={(record) => ({
                                                onClick: (e) => {
                                                    e.stopPropagation();
                                                },
                                            })}
                                            dataSource={salaryPeriodAutoComplete?.filter((item) => item.state == 2)}
                                        />
                                    </div>
                                </Modal>
                            </BaseTooltip>
                        );
                    },
                    team: ({ id, name, status, leaderInfo }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.team)}>
                            <Button
                                type="link"
                                style={{ padding: '0' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const pathDefault = `?projectId=${id}&projectName=${name}`;
                                    let path;
                                    if (leaderName) {
                                        path =
                                            routes.learderProjectTeamListPage.path +
                                            pathDefault +
                                            `&leaderId=${leaderInfo.id}&leaderName=${leaderName}`;
                                    } else if (developerName) {
                                        path =
                                            routes.developerProjectTeamListPage.path +
                                            pathDefault +
                                            `&developerId=${developerId}&developerName=${developerName}`;
                                    } else {
                                        if (status == 1) {
                                            path = routes.teamListPage.path + pathDefault + `&active=${true}`;
                                        } else path = routes.teamListPage.path + pathDefault;
                                    }
                                    navigate(path);
                                }}
                            >
                                <IconBrandTeams color="#2e85ff" size={17} style={{ marginBottom: '-2px' }} />
                            </Button>
                        </BaseTooltip>
                    ),
                    projectCategory: ({ id, name }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.projectCategory)}>
                            <Button
                                type="link"
                                style={{ padding: '0' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const pathDefault = `?projectId=${id}&projectName=${name}`;

                                    navigate(routes.projectCategoryListPage.path + pathDefault);
                                }}
                            >
                                <IconCategory size={16} />
                            </Button>
                        </BaseTooltip>
                    ),
                    moneyForDev: ({ id, isRegisteredSalaryPeriod,registerSalaryPeriod }) => {
                        if(isRegisteredSalaryPeriod){
                            return (
                                <BaseTooltip title={translate.formatMessage(commonMessage.updateRegisterPayout)}>
                                    <Button
                                        disabled={isCheckExist}
                                        type="link"
                                        style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setRegisterSalaryItem(registerSalaryPeriod);
                                            handlerModalUpdateCaculateSalary.open();
                                        }}
                                    >
                                        <IconReportMoney size={'18px'} color={isCheckExist ? 'gray' : 'orange'}/>
                                    </Button>
                                    
                                </BaseTooltip>
                            );
                        }
                        return (
                            <BaseTooltip title={translate.formatMessage(commonMessage.registerPayout)}>
                                <Button
                                    disabled={isCheckExist}
                                    type="link"
                                    style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setProjectId(id);
                                        handlerModalCaculateSalary.open();
                                        setProjectId(id);
                                    }}
                                >
                                    <DollarOutlined />
                                </Button>
                            </BaseTooltip>
                        );
                    },
                });

                funcs.changeFilter = (filter) => {
                    const leaderId = queryParams.get('leaderId');
                    const leaderName = queryParams.get('leaderName');
                    const developerId = queryParams.get('developerId');
                    const developerName = queryParams.get('developerName');
                    if (leaderId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ leaderId: leaderId, leaderName: leaderName, ...filter }),
                        );
                    } else if (developerId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ developerId: developerId, developerName: developerName, ...filter }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(serializeParams(filter));
                    }
                };
            },
        });

    const checkMember = (projectId, path) => {
        executeUpdateLeader({
            params: {
                projectId: projectId,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    if (response.data.totalElements == 0) {
                        setHasError(true);
                        setVisible(true);
                    } else {
                        navigate(path);
                    }
                }
            },
            onError: () =>
                notification({
                    type: 'error',
                    title: 'Error',
                }),
        });
    };

    const { execute: executeUpdateLeader } = useFetch(apiConfig.memberProject.autocomplete, { immediate: true });
    const { execute: executeLoading } = useFetch(apiConfig.project.getList, { immediate: false });

    // const { data: dataDeveloperProject, execute: executeGetList } = useFetch(apiConfig.developer.getProject, {
    //     immediate: true,
    //     params: { developerId: developerId },
    // });

    const setBreadRoutes = () => {
        const breadRoutes = [];
        if (leaderName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.leader),
                path: routes.leaderListPage.path,
            });
        } else if (developerName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.developer),
                path: routes.developerListPage.path,
            });
        }
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.project) });

        return breadRoutes;
    };
    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.projectName),
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ].filter(Boolean);
    const handleOnClick = (event, record) => {
        event.preventDefault();
        localStorage.setItem(routes.projectTabPage.keyActiveTab, translate.formatMessage(commonMessage.task));
        navigate(
            routes.projectTabPage.path +
                `?projectId=${record.id}&projectName=${record.name}&active=${!!record.status == 1}`,
        );
    };
    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(commonMessage.projectName),
            dataIndex: 'name',
            render: (name, record) => (
                <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                    {name}
                </div>
            ),
        },

        {
            title: translate.formatMessage(commonMessage.startDate),
            dataIndex: 'startDate',
            render: (startDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate)}</div>;
            },
            width: 140,
            align: 'right',
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: 'endDate',
            render: (endDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate)}</div>;
            },
            width: 140,
            align: 'right',
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
        mixinFuncs.renderActionColumn(
            {
                // salaryPeriod: true,
                // moneyForDev: true,
                moneyForDev: mixinFuncs.hasPermission([apiConfig.registerSalaryPeriod.create?.baseURL, apiConfig.registerSalaryPeriod.update?.baseURL]),
                edit: true,
                delete: true,
            },
            { width: '120px' },
        ),
    ].filter(Boolean);
    console.log(registerSalaryItem?.dueDate);

    console.log(dayjs(registerSalaryItem?.dueDate,DEFAULT_FORMAT));
    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                title={<span style={{ fontWeight: 'normal' }}>{leaderName || developerName}</span>}
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
                    className: styles.search,
                })}
                actionBar={!leaderName && !developerName && mixinFuncs.renderActionBar()}
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
            {hasError && (
                <Modal
                    title={
                        <span>
                            <ExclamationCircleOutlined style={{ color: 'red' }} /> Lỗi
                        </span>
                    }
                    open={visible}
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                >
                    <p>Chưa có sinh viên nào trong dự án, vui lòng kiểm tra lại</p>
                </Modal>
            )}
            <Modal
                title={<span>Đăng ký tính lương dự án</span>}
                open={openedModalCaculateSalary}
                onOk={() => form.submit()}
                onCancel={() => handlerModalCaculateSalary.close()}
            >
                <BaseForm
                    form={form}
                    onFinish={(values) => {
                        values.projectId = projectId;
                        handleFinish(values);
                    }}
                    size="100%"
                >
                    <Card>
                        <Col span={24}>
                            <DatePickerField
                                showTime={false}
                                label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                                name="dueDate"
                                // placeholder="Ngày kết thúc"
                                rules={[
                                    {
                                        validator: validateDueDate,
                                    },
                                ]}
                                format={DEFAULT_FORMAT}
                                style={{ width: '100%' }}
                            />
                        </Col>
                    </Card>
                </BaseForm>
            </Modal>
            <Modal
                title={<span>Cập nhật tính lương dự án</span>}
                open={openedModalUpdateCaculateSalary}
                onOk={() => form.submit()}
                onCancel={() => handlerModalUpdateCaculateSalary.close()}
                okText='Cập nhật'
            >
                <BaseForm
                    form={form}
                    onFinish={(values) => {
                        handleUpdate({ ... values , id : registerSalaryItem.id });
                    }}
                    size="100%"
                >
                    <Card>
                        <Col span={24}>
                            <DatePickerField
                                showTime={false}
                                label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                                name="dueDate"
                                rules={[
                                    {
                                        validator: validateDueDate,
                                    },
                                ]}
                                fieldProps={{
                                    defaultValue: dayjs(registerSalaryItem?.dueDate,DEFAULT_FORMAT),

                                }}
                                format={DEFAULT_FORMAT}
                                style={{ width: '100%' }}
                            />
                        </Col>
                    </Card>
                </BaseForm>
            </Modal>
        </PageWrapper>
    );
};

export default ProjectListPage;
