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
import { taskState } from '@constants/masterData';
const messages = defineMessages({
    objectName: 'Trang thái',
    update: 'Cập nhật',
    updateSuccess: 'Cập nhật {objectName} thành công',
});
const DetailMyTaskModal = ({ open, onCancel, DetailData, ...props }) => {
    const [form] = Form.useForm();

    const translate = useTranslate();

    const stateValues = translate.formatKeys(taskState, ['label']);

    useEffect(() => {
        // form.setFields(data);
        form.setFieldsValue({
            ...DetailData,
        });
    }, [DetailData]);
    return (
        <Modal centered open={open} onCancel={onCancel} footer={null} title={'Chi Tiết Bài học'} {...props}>
            <Card className="card-form" bordered={false}>
                <BaseForm form={form} size="100%">
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Tên Bài học " />}
                                name={['lecture', 'lectureName']}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Tên Môn học" />}
                                name={['lecture', 'subject', 'subjectName']}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Tên leader" />}
                                name={['course', 'leader', 'leaderName']}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Tên khóa học" />}
                                name={['course', 'name']}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Tên sinh viên" />}
                                name={['student', 'fullName']}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Số điện thoại" />}
                                name={['student', 'phone']}
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
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly="true"
                                width="100%"
                                label={<FormattedMessage defaultMessage="Ngày Kết thúc" />}
                                name={'dueDate'}
                            />
                        </Col>
                    </Row>
                    <Col span={12}>
                        <SelectField
                            required
                            name="state"
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            allowClear={false}
                            options={stateValues}
                        />
                    </Col>
                </BaseForm>
            </Card>
        </Modal>
    );
};

export default DetailMyTaskModal;
