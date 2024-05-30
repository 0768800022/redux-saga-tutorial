import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, TIME_FORMAT_DISPLAY } from '@constants';
import apiConfig from '@constants/apiConfig';
import { SalaryOptions, levelOptionSelect, statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { convertUtcToLocalTime, formatDateString, formatMoney } from '@utils';
import { Avatar, Button, Card, Col, Form, Modal, Row, Tag } from 'antd';
import { ProjectOutlined, UserOutlined, ReadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import FolderIcon from '@assets/icons';
import { FieldTypes } from '@constants/formConfig';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import ScheduleFile from '@components/common/elements/ScheduleFile';
import { IconAlarmOff, IconShieldCog } from '@tabler/icons-react';
import useDisclosure from '@hooks/useDisclosure';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import useMoneyUnit from '@hooks/useMoneyUnit';

const message = defineMessages({
    objectName: 'Lập trình viên',
});

const DeveloperListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const salaryValues = translate.formatKeys(SalaryOptions, ['label']);

    const [projectRole, setProjectROle] = useState([]);
    const [studentId, setStudentId] = useState();
    const { execute: executeTakeDayOff } = useFetch(apiConfig.dayOffLog.create);
    const [openedModalCaculateSalary, handlerModalCaculateSalary] = useDisclosure(false);
    const [form] = Form.useForm();
    const handleFinish = (values) => {
        values.startDate = values.startDate && formatDateString(values.startDate, DEFAULT_FORMAT);
        values.endDate = values.endDate && formatDateString(values.endDate, DEFAULT_FORMAT);
        executeTakeDayOff({
            data: { ...values },
            onCompleted: (response) => {
                handlerModalCaculateSalary.close();
                if (response?.result == true) {
                    showSucsessMessage(translate.formatMessage(commonMessage.success_day_off));
                }
            },
            onError: (error) => {
                handlerModalCaculateSalary.close();
                showErrorMessage(translate.formatMessage(commonMessage.error_day_off));
            },
        });
        form.resetFields();
    };
    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };

    const { data, mixinFuncs, loading, pagination, queryFilter, serializeParams } = useListBase({
        apiConfig: apiConfig.developer,
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
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(serializeParams(filter));
            };
            funcs.additionalActionColumnButtons = () => ({
                permission: ({ id, accountDto }) => {
                    return (
                        <BaseTooltip title={translate.formatMessage(commonMessage.knowledge)}>
                            <Button
                                type="link"
                                style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.developerPermissionListPageKnowledge.path +
                                            `?developerId=${id}&developerName=${accountDto?.fullName}`,
                                    );
                                }}
                            >
                                <ReadOutlined />
                            </Button>
                        </BaseTooltip>
                    );
                },
                project: ({ id, accountDto }) => {
                    return (
                        <BaseTooltip title={translate.formatMessage(commonMessage.project)}>
                            <Button
                                type="link"
                                style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.developerProjectListPage.path +
                                            `?developerId=${id}&developerName=${accountDto?.fullName}`,
                                    );
                                }}
                            >
                                <FolderIcon />
                            </Button>
                        </BaseTooltip>
                    );
                },
                dayoff: ({ id, name, status }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.take_off)}>
                        <Button
                            type="link"
                            style={{ padding: '0' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setStudentId(id);
                                handlerModalCaculateSalary.open();
                            }}
                        >
                            <IconAlarmOff color="#2e85ff" size={17} style={{ marginBottom: '-2px' }} />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });
    const moneyUnit = useMoneyUnit();
    const columns = [
        {
            title: '#',
            dataIndex: ['accountDto', 'avatar'],
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
            title: 'Họ và tên',
            dataIndex: ['accountDto', 'fullName'],
        },
        {
            title: 'Lương cứng',
            dataIndex: ['salary'],
            align: 'right',
            width: 150,
            render: (salary) => {
                const formattedValue = formatMoney(salary, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '2',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: 'Lương theo giờ',
            dataIndex: ['hourlySalary'],
            align: 'right',
            width: 150,
            render: (salary) => {
                const formattedValue = formatMoney(salary, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '2',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: 'Số điện thoại',
            dataIndex: ['accountDto', 'phone'],
            width: 150,
        },

        {
            title: 'Lịch trình',
            dataIndex: 'schedule',
            align: 'center',
            render: (schedule) => {
                return <ScheduleFile schedule={schedule} />;
            },
            width: 180,
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            {
                permission: mixinFuncs.hasPermission([apiConfig.knowledgePermission.getList?.baseURL]),
                project: mixinFuncs.hasPermission([apiConfig.project.getList?.baseURL]),
                dayoff: mixinFuncs.hasPermission([apiConfig.dayOffLog.create?.baseURL]),
                edit: true,
                delete: true,
            },
            { width: 160 },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.name),
        },
        {
            key: 'salaryKind',
            placeholder: translate.formatMessage(commonMessage.salary),
            type: FieldTypes.SELECT,
            options: salaryValues,
            submitOnChanged: true,
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
            submitOnChanged: true,
        },
    ];
    const { data: projectroles, execute: executesprojectroles } = useFetch(apiConfig.projectRole.autocomplete, {
        immediate: true,
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.id,
                label: item.projectRoleName,
            })),
    });
    useEffect(() => {
        if (projectroles) {
            setProjectROle(projectroles);
        }
    }, [projectroles]);

    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.developer) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            ></ListPage>
            <Modal
                title={<span>Xin nghỉ phép</span>}
                open={openedModalCaculateSalary}
                onOk={() => form.submit()}
                onCancel={() => handlerModalCaculateSalary.close()}
            >
                <BaseForm
                    form={form}
                    onFinish={(values) => {
                        values.developerId = studentId;
                        handleFinish(values);
                    }}
                    size="100%"
                >
                    <Card>
                        <Row gutter={16}>
                            <Col span={12}>
                                <DatePickerField
                                    showTime={true}
                                    label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                                    name="startDate"
                                    format={DEFAULT_FORMAT}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col span={12}>
                                <DatePickerField
                                    showTime={true}
                                    label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                                    name="endDate"
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
                        </Row>
                    </Card>
                </BaseForm>
            </Modal>
        </PageWrapper>
    );
};

export default DeveloperListPage;
