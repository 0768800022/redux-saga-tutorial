import { Card, Col, Row,Button,Form } from 'antd';
import React from 'react';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import { DATE_FORMAT_VALUE,DEFAULT_FORMAT } from '@constants/index';
import { formatDateString } from '@utils/index';
import dayjs from 'dayjs';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { useNavigate } from 'react-router-dom';
import useNotification from '@hooks/useNotification';
import { useIntl } from 'react-intl';

const messages = defineMessages({
    asignAll: 'Tạo',
    objectName: 'Bài giảng',
    dueDate: 'Ngày kết thúc',
    startDate: 'Ngày bắt đầu',
    asignAllSuccess:'Áp dụng {objectName} thành công',
});

const AsignAllForm = ({ courseId, lectureId,setHasError }) => {
    const translate = useTranslate();

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const notification = useNotification();
    const intl = useIntl();

    const { execute: executeAsign } = useFetch(apiConfig.task.asignALl,{ immediate: false });
 
    const asignALl = (values) => {
        executeAsign({
            data:{
                courseId: courseId,
                dueDate : formatDateString(values.dueDate, DEFAULT_FORMAT),
                lectureId: lectureId,
                note : values.note,
                startDate : values.startDate ? (formatDateString(values.startDate, DEFAULT_FORMAT)) : formatDateString(new Date(), DEFAULT_FORMAT),
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    notification({
                        message: 
                        intl.formatMessage(messages.asignAllSuccess, {
                            objectName: translate.formatMessage(messages.objectName),
                        }),
                    });
                    return navigate(-1);
                }

            },
            onError: (err) => {
                if( err.response.data.message == 'ERROR-COURSE-ERROR-0003'){
                    setHasError(true); 
                }
            },
        });
    };

    const initialValues = {
        startDate: dayjs(formatDateString(new Date(), DEFAULT_FORMAT)),
    };
    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };
    return (
        <BaseForm 
            form={form}
            onFinish={asignALl} 
            size = "100%"
            initialValues={initialValues}
        >
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <DatePickerField
                            showTime = {true}
                            required
                            name="startDate"
                            label={translate.formatMessage(messages.startDate)}                            
                            placeholder="Ngày bắt đầu"
                            format={DEFAULT_FORMAT}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            showTime = {true}
                            name={"dueDate"}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày kết thúc',
                                },
                                {
                                    validator: validateDueDate,
                                },
                            ]}
                            label={translate.formatMessage(messages.dueDate)}
                            placeholder="Ngày kết thúc"
                            format={DEFAULT_FORMAT}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            name="note"
                            label="Chú thích"
                            type="textarea"
                        />
                    </Col>
                </Row>
                <div style={{ float: 'right' }}>
                    <Button key="submit" type="primary" htmlType="submit">
                        {translate.formatMessage(messages.asignAll)}
                    </Button>
                </div>
                
            </Card>
        </BaseForm>
    );
};

export default AsignAllForm;
