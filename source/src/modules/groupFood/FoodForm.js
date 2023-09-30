import CropImageField from '@components/common/form/CropImageField';
import DropdownField from '@components/common/form/DropdownField';
import NumericField from '@components/common/form/NumericField';
import TextField from '@components/common/form/TextField';
import { AppConstants, STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { GoodsKinds, commonStatusOptions, formSize, goodsKinds, goodsTypes } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const FoodForm = (props) => {
    const {
        formId,
        actions,
        dataDetail,
        onSubmit,
        setIsChangedFormValues,
        size = 'small',
    } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);

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
                    setIsChangedFormValues(true);
                    setImageUrl(response.data.filePath);
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
            imagePath: dataDetail.imagePath,
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
        >
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label="Image"
                            name="imagePath"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={10 / 3}
                            imgUploadedSizeAuto
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label="Group Food Name" name="name" required />
                    </Col>
                    <Col span={12}>
                        <TextField type="textarea" label="Description" name="description" />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <DropdownField
                            initialValue={STATUS_ACTIVE}
                            label="Status"
                            name="status"
                            options={commonStatusOptions}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <DropdownField label="Type" name="type" options={goodsTypes} required />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <DropdownField
                            initialValue={GoodsKinds.COMMON}
                            label="Kind"
                            name="kind"
                            options={goodsKinds}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <TextField required label="PLU" name="plu" />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <NumericField label="Price" name="price" min={0} required />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};

export default FoodForm;
