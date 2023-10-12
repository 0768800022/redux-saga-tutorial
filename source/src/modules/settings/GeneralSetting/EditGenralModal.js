import TextField from '@components/common/form/TextField';
import { Card, Col, Form, Modal, Row } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

const EditGenralModal = ({ open, onCancel, onOk, title, data }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        // form.setFields(data);
        console.log(data);
    }, [data]);
    return (
        <Modal
            centered
            open={open}
            onCancel={onCancel}
            onOk={onOk}
            title={title ?? <FormattedMessage defaultMessage="CẬP NHẬT THIẾT LẬP CHUNG" />}
        >
            <Card className="card-form" bordered={false}>
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={24}>
                            <TextField label={<FormattedMessage defaultMessage="Tên" />} name="keyName" />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <TextField label={<FormattedMessage defaultMessage="Giá trị" />} name="valueData" />
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Modal>
    );
};

export default EditGenralModal;
