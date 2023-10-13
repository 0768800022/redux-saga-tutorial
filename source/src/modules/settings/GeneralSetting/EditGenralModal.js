import TextField from '@components/common/form/TextField';
import { Card, Col, Form, Modal, Row, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useNotification from '@hooks/useNotification';
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import useTranslate from '@hooks/useTranslate';

const messages = defineMessages({
    objectName: 'setting',
    updateSuccess:'Cập nhật {objectName} thành công',
});
const EditGenralModal = ({ open, onCancel,onOk, title, data,executeUpdate,executeLoading }) => {
    const [form] = Form.useForm();
    const [isChanged, setChange] = useState(false);
    const notification = useNotification();
    const intl = useIntl();
    const translate = useTranslate();

    const updateSetting = (values) => {
        executeUpdate({
            data:{
                id: data.id,
                isSystem: data.isSystem,
                status: data.status,
                valueData: values?.valueData,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onCancel();
                    notification({
                        message: 
                        intl.formatMessage(messages.updateSuccess, {
                            objectName: translate.formatMessage(messages.objectName),
                        }),
                    });
                    executeLoading();
                    setChange(false);
                }
            },
            onError: (err) => {
            },
        });
    };

    const handleInputChange = () => {
        setChange(true);
    };

    useEffect(() => {
        // form.setFields(data);
        form.setFieldsValue({
            ...data,
        });
    }, [data]);
    return (
        <Modal
            centered
            open={open}
            onCancel={onCancel}
            footer={null}
            title={title ?? <FormattedMessage defaultMessage="CẬP NHẬT THIẾT LẬP CHUNG" />}
        >
            <Card className="card-form" bordered={false}>
                <BaseForm 
                    form={form} 
                    onFinish={updateSetting}
                    size = "100%"
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <TextField label={<FormattedMessage defaultMessage="Tên" />} name="keyName" disabled ="true" />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <TextField 
                                label={<FormattedMessage defaultMessage="Giá trị" />} 
                                name="valueData"
                                onChange={handleInputChange}
                            />
                        </Col>
                    </Row>
                    <div style={{ float: 'right' }}>
                        <Button 
                            key="submit" type="primary" 
                            htmlType="submit" 
                            disabled={!isChanged}                             
                        >
                            Cập nhật
                        </Button>
                    </div>
                </BaseForm>
            </Card>
        </Modal>
    );
};

export default EditGenralModal;
