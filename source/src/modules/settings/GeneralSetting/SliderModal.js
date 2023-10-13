import TextField from '@components/common/form/TextField';
import { Card, Col, Form, Modal, Row, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useNotification from '@hooks/useNotification';
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';

const messages = defineMessages({
    objectName: 'slider',
    updateSuccess: 'Cập nhật {objectName} thành công',
    createSuccess: 'Thêm mới {objectName} thành công',
});
const SliderModal = ({
    open,
    onCancel,
    title,
    data,
    reload,
    executeUpdate,
    executeLoading,
    sliderData,
    parentData,
    isEditing,
}) => {
    const [form] = Form.useForm();
    const [isChangeValues, setIsChangeValues] = useState(false);
    const notification = useNotification();
    const intl = useIntl();
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const updateSetting = (values) => {
        values.imageUrl = imageUrl;
        const sliderIndex = sliderData.findIndex((obj) => obj.action === data?.action);
        if (sliderIndex !== -1 && isEditing) {
            sliderData.splice(sliderIndex, 1, { action: data?.action, ...values });
        } else {
            sliderData.push({ action: sliderData[sliderData.length - 1]?.action + 1, ...values });
        }

        executeUpdate({
            data: {
                id: parentData?.id,
                isSystem: parentData?.isSystem,
                status: parentData?.status,
                valueData: JSON.stringify(sliderData),
            },
            onCompleted: async (response) => {
                if (response.result === true) {
                    onCancel();
                    notification({
                        message: intl.formatMessage(isEditing ? messages.updateSuccess : messages.createSuccess, {
                            objectName: translate.formatMessage(messages.objectName),
                        }),
                    });
                    executeLoading();
                    setIsChangeValues(false);
                    reload();
                    form.resetFields();
                    setImageUrl(null);
                }
            },
            onError: (err) => {},
        });
    };

    const handleFormChange = () => {
        setIsChangeValues(true);
    };

    useEffect(() => {
        if (isEditing) {
            form.setFieldsValue({
                ...data,
            });
            setImageUrl(data?.imageUrl);
        } else {
            const nullData = Object.keys(data).reduce((acc, key) => {
                acc[key] = null;
                return acc;
            }, {});
            form.setFieldsValue({ ...nullData });
            setImageUrl(null);
        }
    }, [data, isEditing]);
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
                    setIsChangeValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };
    return (
        <Modal
            centered
            open={open}
            onCancel={onCancel}
            footer={null}
            title={(isEditing ? 'CẬP NHẬT' : 'THÊM MỚI') + ' SLIDER'}
        >
            <Card className="card-form" bordered={false}>
                <BaseForm form={form} onFinish={updateSetting} size="100%" onValuesChange={handleFormChange}>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Hình nền" />}
                            name="imageUrl"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                    <Row gutter={16}>
                        <Col span={24}>
                            <TextField label={<FormattedMessage defaultMessage="Tiêu đề" />} name="title" />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <TextField label={<FormattedMessage defaultMessage="Đường dẫn" />} name="targetUrl" />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <TextField
                                label={<FormattedMessage defaultMessage="Mô tả ngắn" />}
                                name="shortDescription"
                                type="textarea"
                            />
                        </Col>
                    </Row>
                    <div style={{ float: 'right' }}>
                        <Button key="submit" type="primary" htmlType="submit" disabled={!isChangeValues}>
                            {isEditing ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </BaseForm>
            </Card>
        </Modal>
    );
};

export default SliderModal;
