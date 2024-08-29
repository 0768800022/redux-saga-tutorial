import { Card, Col, Row, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants/index';
import { formatDateString } from '@utils/index';
import dayjs from 'dayjs';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import useFetch from '@hooks/useFetch';
import { FormattedMessage, defineMessages } from 'react-intl';
import apiConfig from '@constants/apiConfig';
import { statusOptions, lectureState } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants, categoryKinds } from '@constants';
import { commonMessage } from '@locales/intl';
import NumericField from '@components/common/form/NumericField';

const CourseForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const kindOfEdu = categoryKinds.CATEGORY_KIND_EDUCATION;
    const kindOfGen = categoryKinds.CATEGORY_KIND_GENERATION;
    const [currentKindOfEdu, setCurrentKindOfEdu] = useState(kindOfEdu);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const lectureValues = translate.formatKeys(lectureState, ['label']);
    

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const {
        data: categorys,
        loading: getCategorysLoading,
        execute: executeGetCategorys,
    } = useFetch(apiConfig.category.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.categoryName })),
    });
    // useEffect(() => {
    //     executeGetCategorys({
    //         params: {},
    //     });
    // }, []);
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        // dataDetail.dateEnd = dataDetail?.account?.dateEnd && dayjs(dataDetail?.account?.dateEnd, DATE_FORMAT_VALUE);
        setImageUrl(dataDetail.avatar);
        dataDetail.createdDate = dataDetail.createdDate && dayjs(dataDetail.createdDate, DEFAULT_FORMAT);
        dataDetail.dateEnd = dataDetail.dateEnd && dayjs(dataDetail.dateEnd, DEFAULT_FORMAT);
        form.setFieldsValue({
            ...dataDetail,
            // university: dataDetail?.category?.categoryName,
            name : dataDetail?.name,
            subjectName : dataDetail?.subject?.subjectName,
            fullName : dataDetail?.leader?.account?.fullName,
            leaderId: dataDetail?.leader?.account?.id,
            subjectId: dataDetail?.subject?.id,
            state: dataDetail?.state,
            fee: dataDetail?.fee,
            returnFee : dataDetail?.returnFee,
        });
        setImageUrl(dataDetail?.avatar);
    }, [dataDetail]);

    const handleSubmit = (values) => {
        // values.birthday = formatDateString(values?.birthday, DATE_FORMAT_VALUE) + ' 00:00:00';
        values.createdDate = formatDateString(values.createdDate, DEFAULT_FORMAT);
        values.dateEnd = formatDateString(values.dateEnd, DEFAULT_FORMAT);
        
        return mixinFuncs.handleSubmit({ ...values, avatar: imageUrl });
    };

    const validateDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isAfter(date)) {
            return Promise.reject('Ngày sinh phải nhỏ hơn ngày hiện tại');
        }
        return Promise.resolve();
    };

    const checkPhone = (_, value) => {
        const phoneRegex = /^[0-9]{10}$/; // Regex để kiểm tra số điện thoại có 10 chữ số
        if (!phoneRegex.test(value)) {
            return Promise.reject('Số điện thoại không hợp lệ, vui lòng nhập lại');
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
    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Avatar" />}
                            name="avatar"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                    {/* <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Banner" />}
                            name="avatar"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col> */}
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.courseName)}
                            required={isEditing ? false : true}
                            name="name"
                        />
                    </Col>
                    <Col span={12}>
                        {/* <TextField
                            label={translate.formatMessage(commonMessage.subject)}
                            type="Môn học"
                            name="subjectName"
                            required={isEditing ? false : true}
                        /> */}

                        <AutoCompleteField
                            label={translate.formatMessage(commonMessage.subject)}
                            name={['subjectId']}
                            apiConfig={apiConfig.subject.autocomplete} 
                            mappingOptions={(item) => ({ value: item.id, label: item.subjectName })}
                            searchParams={(text) => ({ subjectName: text })}
                            required={isEditing ? false : true}
                        />

                    </Col>
                    
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <DatePickerField
                            name="createdDate"
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            placeholder="Ngày bắt đầu"
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%' }}
                            
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày bắt đầu',
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="dateEnd"
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
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.description)}
                            type="Mô tả"
                            name="description"
                            required={isEditing ? false : true}
                        />
                    </Col>
                </Row>


                <Row gutter={16}>

                    <Col span={12}>
                        {/* <TextField
                            label={translate.formatMessage(commonMessage.leader)}
                            type="Leader"
                            name="fullName"
                            required={isEditing ? false : true}
                        /> */}

                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Leader" />}
                            name={['leaderId']}
                            apiConfig={apiConfig.developer.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.account.fullName })}
                            // initialSearchParams={{ pageNumber: 0 }}
                            searchParams={(text) => ({ name: text })}
                            required={isEditing ? false : true}
                        />

                    </Col>

                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Tình Trạng" />}
                            name="state"
                            options={lectureValues}
                        />
                    </Col>

                    <Col span={12}>
                        <NumericField
                            label={translate.formatMessage(commonMessage.prices)}
                            // required={isEditing ? false : true}
                            name="fee" 
                            min={0}
                            max={100000000000000}
                            addonAfter="đ"
                        />
                    </Col>

                    <Col span={12}>
                        <NumericField
                            label={translate.formatMessage(commonMessage.returnFee)}
                            // required={isEditing ? false : true}
                            name="returnFee"
                            min={0}
                            max={100000000000000}
                            addonAfter="đ"
                        />
                    </Col>

                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="state"
                            options={statusValues}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default CourseForm;
