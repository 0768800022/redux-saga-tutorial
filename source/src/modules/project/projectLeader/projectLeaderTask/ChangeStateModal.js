import TextField from '@components/common/form/TextField';
import { Card, Col, Form, Modal, Row, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useNotification from '@hooks/useNotification';
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import SelectField from '@components/common/form/SelectField';
import { statusOptions, projectTaskState } from '@constants/masterData';
const messages = defineMessages({
    objectName: 'Trang thái',
    update: 'Cập nhật',
    updateSuccess: 'Cập nhật {objectName} thành công',
});
const ChangeStateModal = ({
    open,
    onCancel,
    onOk,
    title,
    data,
    introduceData,
    executeUpdate,
    executeLoading,
    setLoading,
    ...props
}) => {
    const [form] = Form.useForm();
    const [isChanged, setChange] = useState(false);
    const notification = useNotification();
    const intl = useIntl();
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const projectTaskStateValues = translate.formatKeys(projectTaskState, ['label']);
    const updateSetting = (values) => {
        executeUpdate({
            data: {
                ...values,
                id: data.id,
                // state: data.state,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onCancel();
                    notification({
                        message: intl.formatMessage(messages.updateSuccess, {
                            objectName: translate.formatMessage(messages.objectName),
                        }),
                    });
                    executeLoading();
                    setChange(false);
                }
            },
            onError: (err) => {},
        });
    };

    const handleInputChange = () => {
        setChange(true);
    };

    useEffect(() => {
        // form.setFields(data);
        form.setFieldsValue({
            ...introduceData,
        });
    }, [introduceData]);
    return (
        <Modal centered open={open} onCancel={onCancel} footer={null} title={data?.keyName} {...props}>
            <Card className="card-form" bordered={false}>
                <BaseForm form={form} onFinish={updateSetting} size="100%">
                    <SelectField
                        required
                        name="state"
                        label={<FormattedMessage defaultMessage="Trạng thái" />}
                        allowClear={false}
                        options={projectTaskStateValues}
                        onChange={handleInputChange}
                    />

                    <div style={{ float: 'left' }}>
                        <Button key="submit" type="primary" htmlType="submit" disabled={!isChanged}>
                            {intl.formatMessage(messages.update)}
                        </Button>
                    </div>
                </BaseForm>
            </Card>
        </Modal>
    );
};

export default ChangeStateModal;
