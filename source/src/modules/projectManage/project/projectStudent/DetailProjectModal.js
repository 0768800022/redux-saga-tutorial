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
import RichTextField from '@components/common/form/RichTextField';
const messages = defineMessages({
    objectName: 'Trang thái',
    update: 'Cập nhật',
    updateSuccess: 'Cập nhật {objectName} thành công',
});
const DetailProjectModal = ({
    open,
    onCancel,
    onOk,
    title,
    data,
    DetailData,
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
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
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
            ...DetailData,
        });
    }, [DetailData]);
    return (
        <Modal centered open={open} onCancel={onCancel} footer={null} title={'Chi tiết dự án'} {...props}>
            <Card className="card-form" bordered={false}>
                <BaseForm form={form} size="100%">
                    <TextField
                        readOnly="true"
                        width="100%"
                        label={<FormattedMessage defaultMessage="Tên Dự án" />}
                        name="name"
                    />
                    <TextField
                        readOnly="true"
                        width="100%"
                        label={<FormattedMessage defaultMessage="Tên Leader" />}
                        name={['leaderInfo', 'leaderName']}
                    />
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                                name={'startDate'}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Ngày Kết thúc" />}
                                name={'endDate'}
                            />
                        </Col>
                    </Row>
                    <Col span={12}>
                        <SelectField
                            name="state"
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            allowClear={false}
                            options={projectTaskStateValues}
                            disabled
                        />
                    </Col>

                    <RichTextField
                        label={<FormattedMessage defaultMessage="Mô tả" />}
                        labelAlign="left"
                        name="description"
                        style={{
                            height: 300,
                            marginBottom: 70,
                        }}
                        required
                    />
                </BaseForm>
            </Card>
        </Modal>
    );
};

export default DetailProjectModal;
