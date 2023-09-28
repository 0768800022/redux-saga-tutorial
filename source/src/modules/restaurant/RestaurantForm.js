import CropImageField from '@components/common/form/CropImageField';
import TextField from '@components/common/form/TextField';
import { AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import { formSize } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    logo: 'Logo',
    banner: 'Banner',
    storeName: 'Restaurant Name',
    storePath: 'Restaurant Path',
    hotline: 'Hot Line',
    zipCode: 'Zip Code',
    city: 'City',
    address: 'Address',
});

const RestaurantForm = (props) => {
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing, size = 'small' } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);
    const [logoUrl, setLogoUrl] = useState(null);
    const translate = useTranslate();
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const uploadAvatarFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const uploadLogoFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'LOGO',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setIsChangedFormValues(true);
                    setLogoUrl(response.data.filePath);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({
            ...values,
            bannerPath: imageUrl,
            logoPath: logoUrl,
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            fullName: dataDetail?.accountDto?.fullName,
            email: dataDetail?.accountDto?.email,
            username: dataDetail?.accountDto?.username,
        });
        setImageUrl(dataDetail?.bannerPath);
        setLogoUrl(dataDetail?.logoPath);
    }, [dataDetail]);

    return (
        <Form
            style={{ width: formSize[size] ?? size }}
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
        >
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={translate.formatMessage(messages.logo)}
                            name="logoPath"
                            imageUrl={logoUrl && `${AppConstants.contentRootUrl}${logoUrl}`}
                            uploadFile={uploadLogoFile}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <CropImageField
                            label={translate.formatMessage(messages.banner)}
                            name="bannerPath"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={40 / 9}
                            style={{ width: 100, height: 100 }}
                            uploadFile={uploadAvatarFile}
                            imgUploadedSizeAuto
                        />
                    </Col>
                </Row>

                {/* <FieldSet title="Account Info" className={styles.customFieldset}> */}
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(messages.storeName)}
                            name="storeName"
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(messages.storePath)}
                            required
                            name="storePath"
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(messages.hotline)} name="hotline" />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(messages.zipCode)} required name="zipCode" />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(messages.city)} name="city" required />
                    </Col>
                    <Col span={12}>
                        <TextField
                            type="textarea"
                            label={translate.formatMessage(messages.address)}
                            required
                            name="address"
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};

export default RestaurantForm;
