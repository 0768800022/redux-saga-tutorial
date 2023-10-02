import CropImageField from '@components/common/form/CropImageField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { AppConstants, STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { formSize, statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    image: 'Image',
    name: 'Name',
    status: 'Status',
    description: 'Description',
});

function CategoryForm({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, size = 'small' }) {
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'LOGO',
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

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values, imagePath: imageUrl });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setImageUrl(dataDetail.imagePath);
    }, [dataDetail]);

    return (
        <Form
            style={{ width: formSize[size] ?? size }}
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
            initialValues={{ status: STATUS_ACTIVE }}
        >
            <Card className="card-form" bordered={false}>
                {/* <CropImageField
                    label={translate.formatMessage(messages.image)}
                    name="imagePath"
                    imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                    aspect={1 / 1}
                    uploadFile={uploadFile}
                /> */}
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField required label={translate.formatMessage(messages.name)} name="categoryName" />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            name="status"
                            label={translate.formatMessage(messages.status)}
                            allowClear={false}
                            options={statusValues}
                        />
                    </Col>
                </Row>
                {/* <Row gutter={10}>
                    <Col span={24}>
                        <TextField
                            required
                            label={translate.formatMessage(messages.description)}
                            name="description"
                            type="textarea"
                        />
                    </Col>
                </Row> */}

                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
}

export default CategoryForm;