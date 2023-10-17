import { Card, Col, Row, Input } from 'antd';
import React, { useEffect } from 'react';
import SelectField from '@components/common/form/SelectField';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useFetch from '@hooks/useFetch';
import { FormattedMessage } from 'react-intl';
import apiConfig from '@constants/apiConfig';
import { useState } from 'react';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants, DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants';
import { statusOptions } from '@constants/masterData';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import DatePickerField from '@components/common/form/DatePickerField';
import dayjs from 'dayjs';
import { formatDateString } from '@utils';
import NumericField from '@components/common/form/NumericField';
import { commonMessage } from '@locales/intl';
import ListPage from '@components/common/layout/ListPage';
import { Button, Modal, Radio } from 'antd';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListDetailsForm from './ListDetails/ListDetailsForm';
import { useLocation } from 'react-router-dom';
import useDisclosure from '@hooks/useDisclosure';
import BaseTable from '@components/common/table/BaseTable';


const CompanyRequestForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
    const translate = useTranslate();
    const [logoUrl, setLogoUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { pathname: pagePath } = useLocation();
    const location = useLocation();
    const { data: dataListDetails } = location.state;
    const [openedDetailsModal, handlerDetailsModal] = useDisclosure(false);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const uploadLogoFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'LOGO',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setLogoUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const handleSubmit = (values) => {
        values.startDate = formatDateString(values.startDate, DEFAULT_FORMAT);
        values.dueDate = formatDateString(values.dueDate, DEFAULT_FORMAT);
        // const dataListDetails = dataListDetails1();
        if (isEditing) {
            const listDetails = [{
                amount: dataDetail?.listDetails[0]?.amount,
                projectRoleId: dataDetail?.listDetails[0]?.projectRoleId,
                requirement: dataDetail?.listDetails[0]?.requirement,
                status: dataDetail?.listDetails[0]?.status,
                id: dataDetail?.listDetails[0]?.id,
            }];
            return mixinFuncs.handleSubmit({ ...values, listDetails });
        }
        const listDetails = [{
            amount: dataListDetails.amount,
            projectRoleId: dataListDetails.projectRoleId,
            requirement: dataListDetails.requirement,
            status: dataListDetails.status,
            id: dataListDetails.id,
        }];
        return mixinFuncs.handleSubmit({ ...values, listDetails });
    };

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[0].value,
            });
        }
    }, [isEditing]);

    const {
        data: companys,
        loading: getcompanyLoading,
        execute: executescompanys,
    } = useFetch(apiConfig.company.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.companyName })),
    });
    const {
        data: serviceCompanySubscription,
        loading: getserviceCompanySubscriptionLoading,
        execute: executesserviceCompanySubscription,
    } = useFetch(apiConfig.serviceCompanySubscription.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.name })),
    });
    useEffect(() => {
        dataDetail.startDate = dataDetail.startDate && dayjs(dataDetail.startDate, DEFAULT_FORMAT);
        dataDetail.dueDate = dataDetail.dueDate && dayjs(dataDetail.dueDate, DEFAULT_FORMAT);
        form.setFieldsValue({
            ...dataDetail,
            companyId: dataDetail?.company?.companyName,
            serviceCompanySubscriptionId: dataDetail?.subscription?.name,
            startDate: dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DEFAULT_FORMAT),
        });
    }, [dataDetail]);
    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };

    const validateStartDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date)) {
            return Promise.reject('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };
    const handleOk = () => {
        setShowPreviewModal(false);
    };
    const handleCancel = () => {
        setShowPreviewModal(false);
    };
    const columnsDetails = [
        {
            title: <FormattedMessage defaultMessage="Vai trò" />,
            dataIndex: ['projectRoleInfo', 'projectRoleName'],
            width: '400px',
        },

        {
            title: <FormattedMessage defaultMessage="Số lượng" />,
            dataIndex: 'amount',
            width: '400px',
        },

        {
            title: <FormattedMessage defaultMessage="Yêu cầu" />,
            dataIndex: 'requirement',
            width: '400px',
        },

    ];
    return (
        <div>
            <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} >
                <Card>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button
                            type="primary"
                            // disabled={hasError ? true : disabledSubmit}
                            // onClick={() => setShowPreviewModal(true)}
                            onClick={(e) => {
                                e.stopPropagation();
                                handlerDetailsModal.open();
                            }}
                        >
                            {<FormattedMessage defaultMessage="Danh sách mô tả" />}
                        </Button>

                        <ListDetailsForm
                            // courseId={courseId}
                            // lectureId={lectureid}
                            setHasError={setHasError}
                            // showPreview={showPreviewModal}
                            open={openedDetailsModal}
                            onCancel={() => handlerDetailsModal.close()}
                            data={dataDetail.listDetails || {}}
                            isEditing={isEditing}
                        />
                    </Col>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                label={<FormattedMessage defaultMessage="Tiêu đề" />}
                                name="title"
                                required
                                disabled={isEditing}
                            />
                        </Col>
                        <Col span={12}>
                            <AutoCompleteField
                                label={<FormattedMessage defaultMessage="Công ty" />}
                                name="companyId"
                                apiConfig={apiConfig.company.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.companyName })}
                                initialSearchParams={{}}
                                searchParams={(text) => ({ companyName: text })}
                                required
                                disabled={isEditing}
                            />
                        </Col>
                        <Col span={12}>
                            <NumericField
                                label={<FormattedMessage defaultMessage="Số lượng công việc" />}
                                name="numberCv"
                                min={0}
                                max={100}
                                required
                            />
                        </Col>
                        <Col span={12}>
                            <SelectField
                                label={<FormattedMessage defaultMessage="Trạng thái" />}
                                name="status"
                                options={statusValues}
                            />
                        </Col>
                        <Col span={12}>
                            <DatePickerField
                                name="startDate"
                                label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                                placeholder="Ngày bắt đầu"
                                format={DEFAULT_FORMAT}
                                style={{ width: '100%' }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn ngày bắt đầu',
                                    },
                                    {
                                        validator: validateStartDate,
                                    },
                                ]}
                            />
                        </Col>
                        <Col span={12}>
                            <DatePickerField
                                label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                                name="dueDate"
                                placeholder="Ngày kết thúc"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn ngày kết thúc',
                                    },
                                    {
                                        validator: validateDueDate,
                                    },
                                ]}
                                format={DEFAULT_FORMAT}
                                style={{ width: '100%' }}
                            />
                        </Col>
                    </Row>
                    <TextField
                        width={'100%'}
                        required
                        label={<FormattedMessage defaultMessage="Mô tả" />}
                        name="description"
                        type="textarea"
                    />
                    <TextField
                        width={'100%'}
                        required
                        label={<FormattedMessage defaultMessage="Mô tả ngắn" />}
                        name="shortDescription"
                        type="textarea"
                    />
                </Card>
            </BaseForm>
            <Card style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px',
                        }}
                    >
                        <span style={{ fontSize: '20px' }}>{<FormattedMessage defaultMessage="Danh sách mô tả" />}</span>
                        <Button
                            type="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                // setIsEditing(false);
                                handlerDetailsModal.open();
                            }}
                        >
                            {<FormattedMessage defaultMessage="Danh sách mô tả" />}
                        </Button>
                    </div>
                    <BaseTable
                        // onChange={mixinFuncs.changePagination}
                        columns={columnsDetails}
                        dataSource={dataDetail.length > 0 ? dataDetail : []}
                    // loading={loading}
                    // pagination={pagination}
                    />
                </Col>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </div>
    );
};

export default CompanyRequestForm;
