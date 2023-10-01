import TextField from '@components/common/form/TextField';
import { Card, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import CropImageField from '@components/common/form/CropImageField';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { AppConstants } from '@constants';
import { Fragment } from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';

const messages = defineMessages({
    avatar: 'Avatar',
    username: 'Username',
    career: 'Career Name',
    fullName: 'Leader',
    email: 'Hot line',
    phoneNumber: 'Phone Number',
    taxNumber: 'Tax Number',
    zipCode: 'Zip Code',
    city: 'City',
    address: 'Address',
    logo: 'Logo',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    passwordLengthError: 'Password must be at least 6 characters',
    passwordMatchError: 'Password does not match',
});

const ProfileForm = (props) => {
    const { formId, dataDetail, onSubmit, setIsChangedFormValues, actions, isAdmin } = props;
    const [imageUrl, setImageUrl] = useState(null);
    const [logoUrl, setLogoUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const translate = useTranslate();

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

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
                    setLogoUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            avatar: dataDetail.avatarPath,
            logo: dataDetail.logoPath,
        });
        setImageUrl(dataDetail.avatarPath);
        setLogoUrl(dataDetail.logoPath);
    }, [dataDetail]);

    const handleFinish = (values) => {
        mixinFuncs.handleSubmit({
            ...values,
            fullName: values.fullName,
            oldPassword: values.oldPassword,
            password: values.password,
            avatar: imageUrl,
            logo: logoUrl,
        });
    };

    return (
        <Card className="card-form" bordered={false} style={{ minHeight: 'calc(100vh - 190px)' }}>
            <Form
                style={{ width: '50%' }}
                labelCol={{ span: 8 }}
                id={formId}
                onFinish={handleFinish}
                form={form}
                layout="horizontal"
                onValuesChange={onValuesChange}
            >
                <CropImageField
                    label={translate.formatMessage(messages.logo)}
                    name="logo"
                    imageUrl={logoUrl && `${AppConstants.contentRootUrl}${logoUrl}`}
                    aspect={1 / 1}
                    required
                    uploadFile={uploadLogoFile}
                />
                {/* <CropImageField
                    label={translate.formatMessage(messages.avatar)}
                    name="avatar"
                    imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                    aspect={1 / 1}
                    uploadFile={uploadFile}
                /> */}
                <TextField
                    readOnly
                    label={translate.formatMessage(messages.username)}
                    name={['accountDto', 'username']}
                />
                <TextField label={translate.formatMessage(messages.career)} name={['careerName']} />
                <TextField label={translate.formatMessage(messages.fullName)} name={['accountDto', 'fullName']} />
                <TextField label={translate.formatMessage(messages.email)} name="hotline" />
                {!isAdmin && (
                    <Fragment>
                        <TextField
                            name={['accountDto', 'phone']}
                            label={translate.formatMessage(messages.phoneNumber)}
                            required
                        />
                    </Fragment>
                )}
                <TextField
                    type="password"
                    label={translate.formatMessage(messages.currentPassword)}
                    required
                    name="oldPassword"
                />
                <TextField
                    type="password"
                    label={translate.formatMessage(messages.newPassword)}
                    name="password"
                    rules={[
                        {
                            validator: async () => {
                                const isTouched = form.isFieldTouched('newPassword');
                                if (isTouched) {
                                    const value = form.getFieldValue('newPassword');
                                    if (value.length < 6) {
                                        throw new Error(translate.formatMessage(messages.passwordLengthError));
                                    }
                                }
                            },
                        },
                    ]}
                />
                <TextField
                    type="password"
                    label={translate.formatMessage(messages.confirmPassword)}
                    rules={[
                        {
                            validator: async () => {
                                const password = form.getFieldValue('newPassword');
                                const confirmPassword = form.getFieldValue('confirmPassword');
                                if (password !== confirmPassword) {
                                    throw new Error(translate.formatMessage(messages.passwordMatchError));
                                }
                            },
                        },
                    ]}
                />

                <div className="footer-card-form">{actions}</div>
            </Form>
        </Card>
    );
};

export default ProfileForm;
