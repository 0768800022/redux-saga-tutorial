import TextField from '@components/common/form/TextField';
import { Col, Form, Modal, Row, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { BaseForm } from '@components/common/form/BaseForm';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { AppConstants } from '@constants';
import { Card } from 'antd';
import CropImageField from '@components/common/form/CropImageField';
import { FormattedMessage } from 'react-intl';
import NumericField from '@components/common/form/NumericField';
import { lectureState } from '@constants/masterData';

const messages = defineMessages({
    objectName: 'Chi tiết khoá học',
});
const PreviewModal = ({
    open,
    onCancel,
    detail,
}) => {
    const translate = useTranslate();
    const [form] = Form.useForm();
    const lectureStateOptions = translate.formatKeys(lectureState, ['label']);
    const [lectureStateFilter, setLectureStateFilter] = useState([lectureStateOptions[0]]);
    const handleOnCancel = () => {
        onCancel();
    };
    return (
        <Modal
            centered
            open={open} 
            onCancel={handleOnCancel}
            onOk={handleOnCancel}
            width={800}
            footer={[
                <Button key="ok" type="primary" onClick={handleOnCancel}>
                  OK
                </Button>,
            ]}
            title={translate.formatMessage(messages.objectName)}
        >
            <BaseForm form={form} style={{ width: "100%" }}>
                <Card className="card-form" bordered={false}>
                    <Row>
                        <Col span={12}>
                            <CropImageField
                                label={<FormattedMessage defaultMessage="Avatar" />}
                                name="avatar"
                                imageUrl={detail && `${AppConstants.contentRootUrl}${detail.avatar}`}
                                aspect={1 / 1}
                            />
                        </Col>
                        <Col span={12}>
                            <CropImageField
                                label={<FormattedMessage defaultMessage="Banner" />}
                                name="banner"
                                imageUrl={detail && `${AppConstants.contentRootUrl}${detail?.banner}`}
                                aspect={4 / 3}
                            />
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Tên khoá học" />}
                                name="name"
                                initialValue={detail.name}
                            />
                        </Col>

                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Môn học" />}
                                name="subjectId"
                                initialValue={detail?.subject?.subjectName}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                                name="dateRegister"
                                initialValue={detail.dateRegister}

                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                                name="dateEnd"
                                initialValue={detail.dateEnd}
                            />
                        </Col>
                    </Row>
                    {/* <TextField
                        width={'100%'}
                        label={<FormattedMessage defaultMessage="Mô tả" />}
                        name="description"
                        type="textarea"
                    /> */}
                    <Row gutter={10}>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Leader" />}
                                name="leaderId"
                                initialValue={detail?.leader?.leaderName}

                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label={<FormattedMessage defaultMessage="Tình trạng" />}
                                readOnly
                                name="state"
                                initialValue={lectureStateFilter[0].label}
                            />
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={12}>
                            <NumericField
                                label={<FormattedMessage defaultMessage="Học phí" />}
                                name="fee"
                                readOnly
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter="₫"
                                defaultValue= {detail?.fee}
                            />
                        </Col>
                        <Col span={12}>
                            <NumericField
                                label={<FormattedMessage defaultMessage="Phí hoàn trả" />}
                                name="returnFee"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter="₫"
                                readOnly
                                defaultValue={detail?.returnFee}
                            />
                        </Col>
                    </Row>
                </Card>
            </BaseForm>
        </Modal>
    );
};

export default PreviewModal;
