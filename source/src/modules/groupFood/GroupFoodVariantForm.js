import CheckboxField from '@components/common/form/CheckboxField';
import CropImageField from '@components/common/form/CropImageField';
import DropdownField from '@components/common/form/DropdownField';
import NumericField from '@components/common/form/NumericField';
import RichTextField from '@components/common/form/RichTextField';
import TextField from '@components/common/form/TextField';
import { AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import { formSize } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useQueryParams from '@hooks/useQueryParams';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Form, Row } from 'antd';
import { default as React, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';
const messages = defineMessages({
    groupFoodName: 'Service Name',
    plu: 'PLU',
    price: 'Price',
    saleOff: 'Sale off',
    description: 'Description',
    shortDescription: 'Short description',
    image: 'Image',
    tag: 'Tag',
    groups: 'Classified Service',
    seoPath: 'Seo path',
});
function GroupFoodVariantForm(props) {
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, size = 'small' } = props;
    const { id, serviceId } = useParams();
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);

    const translate = useTranslate();
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
        let stringKeyWord = '';
        if (values.keyWord.length > 0) {
            values.keyWord.map((item) => {
                stringKeyWord += `${item},`;
            });
        }

        return mixinFuncs.handleSubmit({
            ...values,
            imagePath: imageUrl,
            kind: 1,
            keyWord: stringKeyWord,
            parentId: parseInt(serviceId),
            description: removeBaseURL(values.description),
        });
    };
    const splitKeyword = (data) => {
        if (data) {
            return data.split(',').filter((item) => item.trim() !== '');
        }
        return [];
    };
    const removeBaseURL = (data) => {
        let imgArray = data?.replaceAll(AppConstants.contentRootUrl, '');
        imgArray = imgArray?.replaceAll('src="', 'src="{{baseURL}}');
        return imgArray;
    };
    const insertBaseURL = (data) => {
        const imgArray = data?.replaceAll('{{baseURL}}', `${AppConstants.contentRootUrl}`);
        return imgArray;
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            kind: dataDetail.kind ?? 1,
            imagePath: dataDetail.imagePath,
            keyWord: splitKeyword(dataDetail?.keyWord),
            description: insertBaseURL(dataDetail.description),
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
                            label={translate.formatMessage(messages.image)}
                            name="imagePath"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(messages.groupFoodName)} name="name" required />
                    </Col>
                    <Col span={12}>
                        <NumericField required label={translate.formatMessage(messages.price)} name="price" />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            min={0}
                            max={100}
                            label={translate.formatMessage(messages.saleOff)}
                            name="saleOff"
                        />
                    </Col>
                    <Col span={12}>
                        <DropdownField mode="tags" name="keyWord" label={translate.formatMessage(messages.tag)} />
                    </Col>
                    <Col span={24}>
                        <TextField label={translate.formatMessage(messages.seoPath)} name="seoName" />
                    </Col>
                    <Col span={24}>
                        <TextField
                            type="textarea"
                            label={translate.formatMessage(messages.shortDescription)}
                            name="productInfo"
                        />
                    </Col>
                    <Col span={24} style={{ height: '400px' }}>
                        <RichTextField
                            style={{ height: '250px' }}
                            label={translate.formatMessage(messages.description)}
                            name="description"
                            baseURL={AppConstants.contentRootUrl}
                            setIsChangedFormValues={setIsChangedFormValues}
                            form={form}
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
}

export default GroupFoodVariantForm;
