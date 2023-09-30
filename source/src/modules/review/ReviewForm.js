import CropImageField from '@components/common/form/CropImageField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { AppConstants } from '@constants';
import { formSize } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { Avatar, Card, Col, Form, Rate, Row } from 'antd';
import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { ShopOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
const messages = defineMessages({
    storeName: 'Store Name',
    storeLogo: 'Store Logo',
    customerName: 'Customer Name',
    message: 'Message',
    star: 'Star',
});
function ReviewForm({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, size = 'small' }) {
    const translate = useTranslate();
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };
    useEffect(() => {
        if (Object.keys(dataDetail).length > 0)
            form.setFieldsValue({
                ...dataDetail,
                storeLogo: dataDetail.store.logoPath,
                storeName: dataDetail.store.storeName,
                customerName: dataDetail.customer.userName,
            });
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
                    <Col
                        span={12}
                        className={styles.storeLogo}
                        style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}
                    >
                        <span>{translate.formatMessage(messages.storeLogo)}</span>
                        <Avatar
                            size="large"
                            shape="square"
                            name="storeLogo"
                            aspect={1 / 1}
                            style={{ width: '86px', height: '86px', background: '#e4e4e4' }}
                            icon={<ShopOutlined />}
                            src={
                                form.getFieldValue('storeLogo')
                                    ? `${AppConstants.contentRootUrl}${form.getFieldValue('storeLogo')}`
                                    : null
                            }
                        />
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField readOnly label={translate.formatMessage(messages.storeName)} name="storeName" />
                    </Col>
                    <Col span={12}>
                        <TextField
                            readOnly
                            label={translate.formatMessage(messages.customerName)}
                            name="customerName"
                        />
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={24}>
                        <Form.Item name="star" label={translate.formatMessage(messages.star)}>
                            <Rate disabled value={form.getFieldValue('star')} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={24}>
                        <TextField
                            readOnly
                            label={translate.formatMessage(messages.message)}
                            name="message"
                            type="textarea"
                        />
                    </Col>
                </Row>

                {/* <div className="footer-card-form">{actions}</div> */}
            </Card>
        </Form>
    );
}

export default ReviewForm;
