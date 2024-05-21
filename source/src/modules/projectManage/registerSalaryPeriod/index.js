import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { salaryPeriodState } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { Button, Col, Form, Modal, Tag } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import dayjs from 'dayjs';
import { formatDateString } from '@utils';
import useDisclosure from '@hooks/useDisclosure';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
const message = defineMessages({
    objectName: 'Đăng ký kỳ lương',
});
const RegisterSalaryPeriodListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { execute: executeUpdateCalculateProjectSalary } = useFetch(apiConfig.registerSalaryPeriod.update);
    const [openedModalUpdateCaculateSalary, handlerModalUpdateCaculateSalary] = useDisclosure(false);
    const [form] = Form.useForm();
    const [registerSalaryItem, setRegisterSalaryItem] = useState();

    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.registerSalaryPeriod,
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
                // funcs.getCreateLink = () => {
                //     return `${routes.RegisterSalaryPeriodList.path}/create`;
                // };
                // funcs.getItemDetailLink = (dataRow) => {
                //     return `${routes.RegisterSalaryPeriodList.path}/${dataRow.id}`;
                // };
                funcs.additionalActionColumnButtons = () => ({
                    edit: (dataRow) => {
                        return (
                            <BaseTooltip title={translate.formatMessage(commonMessage.updateRegisterPayout)}>
                                <Button
                                    type="link"
                                    style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setRegisterSalaryItem(dataRow);
                                        handlerModalUpdateCaculateSalary.open();
                                    }}
                                >
                                    <EditOutlined color="red" />
                                </Button>
                            </BaseTooltip>
                        );
                    },
                });
            },
        });

    const convertDate = (date, format = DEFAULT_FORMAT, addHour = 0) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT).add(addHour, 'hour');
        return convertDateTimeToString(dateConvert, format);
    };

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.salaryPeriodName),
        },
    ].filter(Boolean);
    const handleOnClick = (event, record) => {
        navigate(routes.salaryPeriodDetailListPage.path + `?salaryPeriodId=${record.id}`);
    };

    const columns = [
        {
            title: translate.formatMessage(commonMessage.projectName),
            dataIndex: ["project","name"],
            width: 300,
           
        },
        {
            title: translate.formatMessage(commonMessage.dueDate),
            dataIndex: 'dueDate',
            render: (startDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate, DATE_FORMAT_DISPLAY)}</div>
                );
            },
            width: 180,
            align: 'end',
        },  
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: '100px' },
        ),
    ].filter(Boolean);

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(message.objectName),
        },
    ];
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
    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                // searchForm={mixinFuncs.renderSearchForm({
                //     fields: searchFields,
                //     initialValues: queryFilter,
                // })}
                // actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                        onRow={(record, rowIndex) => ({
                            onClick: (e) => {
                                e.stopPropagation();
                               
                            },
                        })}
                    />
                }
            />
            <Modal
                title={<span>Cập nhật đăng ký kỳ lương</span>}
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
                    <Col span={24}>
                        <DatePickerField
                            showTime={true}
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
                </BaseForm>
            </Modal>
        </PageWrapper>
    );
};

export default RegisterSalaryPeriodListPage;
