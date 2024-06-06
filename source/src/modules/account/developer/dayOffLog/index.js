import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    DEFAULT_TABLE_ITEM_SIZE,
    DEFAULT_FORMAT,
    DATE_FORMAT_DISPLAY,
    DATE_FORMAT_ZERO_TIME,
    DATE_FORMAT_END_OF_DAY_TIME,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { dayOfflogOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Button, Card, Col, Form, Modal, Row, Tag } from 'antd';
import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import { PlusOutlined } from '@ant-design/icons';

import {
    convertUtcToLocalTime,
    formatDateString,
} from '@utils';
import dayjs from 'dayjs';
import { FieldTypes } from '@constants/formConfig';
import styles from './index.module.scss';
import useDisclosure from '@hooks/useDisclosure';
import { BaseForm } from '@components/common/form/BaseForm';
import useFetch from '@hooks/useFetch';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import DatePickerField from '@components/common/form/DatePickerField';
import CheckboxField from '@components/common/form/CheckboxField';

const message = defineMessages({
    objectName: 'Nhật ký nghỉ',
    create: {
        id: 'components.common.elements.actionBar.create',
        defaultMessage: 'Add new',
    },
});

function DayOffLogListPage({ setBreadCrumbName }) {
    const translate = useTranslate();
    const intl = useIntl();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const developerName = queryParameters.get('developerName');
    const developerId = queryParameters.get('developerId');
    const [openedModalDayOffLog, handlerModalDayOffLog] = useDisclosure(false);
    
    const search = location.search;
    const [isChecked, setIsChecked] = useState(false);
    const { execute: executeTakeDayOff } = useFetch(apiConfig.dayOffLog.create);
    const { data, mixinFuncs, queryFilter, loading, pagination, queryParams, changePagination, serializeParams } =
        useListBase({
            apiConfig: apiConfig.dayOffLog,
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
                    mixinFuncs.handleFetchList({ ...params, developerId  });
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
                funcs.changeFilter = (filter) => {
                    const developerId = queryParams.get('developerId');
                    const developerName = queryParams.get('developerName');
                    const params = {
                        developerId,
                        developerName,
                        ...filter,
                    };
                    const filteredParams = Object.fromEntries(
                        Object.entries(params).filter(([_, value]) => value != null),
                    );
                    mixinFuncs.setQueryParams(serializeParams(filteredParams));
                };
            },
        });

    const [form] = Form.useForm();
    const handleFinish = (values) => {
        values.isCharged = isChecked;
        values.startDate = values.startDate && formatDateString(values.startDate, DEFAULT_FORMAT);
        values.endDate = values.endDate && formatDateString(values.endDate, DEFAULT_FORMAT);
        executeTakeDayOff({
            data: { ...values },
            onCompleted: (response) => {
                handlerModalDayOffLog.close();
                if (response?.result == true) {
                    showSucsessMessage(translate.formatMessage(commonMessage.success_day_off));
                }
                mixinFuncs.getList();
            },
            onError: (error) => {
                handlerModalDayOffLog.close();
                showErrorMessage(translate.formatMessage(commonMessage.error_day_off));
            },
        });
        form.resetFields();
    };
    const columns = [
        {
            title: translate.formatMessage(commonMessage.startDate),
            width: 180,
            dataIndex: 'startDate',
            render: (startDate) => {
                const startDateLocal = convertUtcToLocalTime(startDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{startDateLocal}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            width: 180,
            dataIndex: 'endDate',
            render: (endDate) => {
                const endDateLocal = convertUtcToLocalTime(endDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{endDateLocal}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.totalTime),
            dataIndex: 'totalHour',
            align:'center',
            width: 150,
            render: (dataRow) => {
                return <div>{dataRow}h</div>;
            },
        },

        {
            title: 'Loại',
            dataIndex: 'isCharged',
            align: 'center',
            width: 120,
            render(dataRow) {
                const kindLog = dayOfflogOptions.find((item) => item.value == dataRow);
                return (
                    <Tag color={kindLog?.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{kindLog?.label}</div>
                    </Tag>
                );
            },
        },
       
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ].filter(Boolean);
    const searchFields = [
        {
            key: 'fromDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.fromDate),
            colSpan: 3,
        },
        {
            key: 'toDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.toDate),
            colSpan: 3,
        },
    ];

    const initialFilterValues = useMemo(() => {
        const initialFilterValues = {
            ...queryFilter,
            fromDate: queryFilter.fromDate && dayjs(formatDateToLocal(queryFilter.fromDate), DEFAULT_FORMAT),
            toDate:
                queryFilter.toDate && dayjs(formatDateToLocal(queryFilter.toDate), DEFAULT_FORMAT).subtract(7, 'hour'),
        };

        return initialFilterValues;
    }, [queryFilter?.fromDate, queryFilter?.toDate]);
    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };
    const handleOnChangeCheckBox = () => {
        setIsChecked(!isChecked);
    };
    const setBreadRoutes = () => {
        const breadRoutes = [];
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.developer),
            path: routes.developerListPage.path,
        });
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.dayOffLog),
        });
        return breadRoutes;
    };
    return (
        <PageWrapper
            routes={setBreadRoutes()}
        >
            <div>
                <ListPage
                    title={
                        <span style={{ fontWeight: 'normal', fontSize: '16px' }}>
                            <span>
                                {developerName}
                            </span>
                        </span>
                    }
                    actionBar={
                        mixinFuncs.hasPermission([apiConfig.knowledgePermission.create?.baseURL]) && (
                            <div style={{ display: 'flex', justifyContent: 'end' }}>
                                <Button type="primary" style={styles} onClick={() => {
                                    handlerModalDayOffLog.open();
                                }}>
                                    <PlusOutlined />{' '}
                                    {intl.formatMessage(message.create, { objectName: message.objectName })}
                                </Button>
                            </div>
                        )
                    }
                    searchForm={mixinFuncs.renderSearchForm({
                        fields: searchFields,
                        className: styles.search,
                        initialValues: initialFilterValues,
                    })}
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
            <Modal
                title={<span>{translate.formatMessage(commonMessage.take_off)}</span>}
                open={openedModalDayOffLog}
                onOk={() => form.submit()}
                onCancel={() => handlerModalDayOffLog.close()}
            >
                <BaseForm
                    form={form}
                    onFinish={(values) => {
                        values.developerId = developerId;
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
                        <Row gutter={16}>
                            <Col span={24}>
                                <CheckboxField
                                    className={styles.customCheckbox}
                                    label={translate.formatMessage(commonMessage.isCharged)}
                                    name="isCharged"
                                    checked={isChecked}
                                    onChange={handleOnChangeCheckBox}
                                />
                            </Col>
                        </Row>
                    </Card>
                </BaseForm>
            </Modal>
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

export default DayOffLogListPage;
