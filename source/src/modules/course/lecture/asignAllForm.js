import { Card, Col, Row,Button,Form } from 'antd';
import React from 'react';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import { DATE_FORMAT_VALUE } from '@constants/index';
import { formatDateString } from '@utils/index';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { useNavigate } from 'react-router-dom';
import useNotification from '@hooks/useNotification';
import { useIntl } from 'react-intl';

const message = defineMessages({
    asignAll: 'Áp dụng',
    objectName: 'Bài giảng',
    dueDate: 'Ngày kết thúc',
    startDate: 'Ngày bắt đầu',
    asignAllSuccess:'Áp dụng {objectName} thành công',
});

const AsignALlForm = ({ courseId, lectureId }) => {

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
                lectureId: lectureId,
                startDate : values.startDate ? (formatDateString(values.startDate, DATE_FORMAT_VALUE) + ' 00:00:00') : formatDateString(new Date(), DATE_FORMAT_VALUE)+ ' 00:00:00',
                dueDate : formatDateString(values.dueDate, DATE_FORMAT_VALUE) + ' 00:00:00',
                note : values.note,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    notification({
                        message: intl.formatMessage(message.asignAllSuccess, {
                            objectName: translate.formatMessage(message.objectName),
                        }),
                    });
                    
                    return navigate(-1);
                }

            },
            onError: (err) => {
            },
        });
    };

    const initialValues = {
        startDate: dayjs(formatDateString(new Date(), DATE_FORMAT_VALUE), DATE_FORMAT_VALUE),
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
                            required
                            name="startDate"
                            label={translate.formatMessage(message.startDate)}                            
                            placeholder="Ngày bắt đầu"
                            format={DATE_FORMAT_VALUE}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
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
                            label={translate.formatMessage(message.dueDate)}
                            placeholder="Ngày kết thúc"
                            format={DATE_FORMAT_VALUE}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập chú thích',
                                },
                            ]}
                            name="note"
                            label="Chú thích"
                            type="textarea"
                        />
                    </Col>
                </Row>
                <div style={{ float: 'right' }}>
                    <Button key="submit" type="primary" htmlType="submit">
                        <PlusOutlined />
                        {translate.formatMessage(message.asignAll)}
                    </Button>
                </div>
                
            </Card>
        </BaseForm>
    );
};

export default AsignALlForm;
