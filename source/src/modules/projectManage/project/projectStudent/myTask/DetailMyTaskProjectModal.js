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
const DetailMyTaskProjectModal = ({ open, onCancel, DetailData, ...props }) => {
    const [form] = Form.useForm();

    const notification = useNotification();

    const translate = useTranslate();

    const projectTaskStateValues = translate.formatKeys(projectTaskState, ['label']);

    useEffect(() => {
        // form.setFields(data);
        form.setFieldsValue({
            ...DetailData,
        });
    }, [DetailData]);
    return (
        <Modal centered open={open} onCancel={onCancel} footer={null} title={'Chi tiết task dự án'} {...props}>
            <Card className="card-form" bordered={false}>
                <BaseForm form={form} size="100%">
                    <TextField
                        readOnly="true"
                        width="100%"
                        label={<FormattedMessage defaultMessage="Tên Task " />}
                        name="taskName"
                        required
                    />
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Tên dự án" />}
                                name={['project', 'name']}
                                required
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Tên leader" />}
                                name={['project', 'leaderInfo', 'leaderName']}
                                required
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Tên lập trình viên" />}
                                name={['developer', 'studentInfo', 'fullName']}
                                required
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Vai trò" />}
                                name={['developer', 'roleInfo', 'projectRoleName']}
                                required
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                                name={'startDate'}
                                required
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Ngày Kết thúc" />}
                                name={'dueDate'}
                                required
                            />
                        </Col>
                    </Row>

                    <Col span={12}>
                        <SelectField
                            required
                            name="state"
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            allowClear={false}
                            options={projectTaskStateValues}
                            autoFocus="false"
                            disabled
                        />
                    </Col>

                    <TextField
                        readOnly="true"
                        width="100%"
                        label={<FormattedMessage defaultMessage="Mô tả dự án" />}
                        name={'description'}
                        required
                        type="textarea"
                    />
                </BaseForm>
            </Card>
        </Modal>
    );
};

export default DetailMyTaskProjectModal;
