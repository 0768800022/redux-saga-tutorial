import { PercentageOutlined } from '@ant-design/icons';
import DatePickerField from '@components/common/form/DatePickerField';
import NumericField from '@components/common/form/NumericField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { DATE_FORMAT_VALUE, STATUS_ACTIVE } from '@constants';
import {
    STATE_PROMOTION_CANCEL,
    STATE_PROMOTION_CREATED,
    STATE_PROMOTION_END,
    STATE_PROMOTION_RUNNING,
    discountTypeOption,
    formSize,
    promotionKindOption,
    statePromotionOptions,
} from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

const message = defineMessages({
    name: 'Campaign Name',
    prefix: 'Prefix',
    kindPromotion: 'Kind Promotion',
    discountType: 'Discount Type',
    discountLimit: 'Discount Limit',
    discountValue: 'Discount Value',
    quantity: 'Quantity',
    service: 'Service',
    startDate: 'Start Date',
    endDate: 'End Date',
    state: 'State',
    description: 'Description',
});

function PromotionForm({
    formId,
    mixinFuncs,
    dataDetail,
    onSubmit,
    setIsChangedFormValues,
    size = 'small',
    isEditing,
}) {
    const translate = useTranslate();
    const [show, setShow] = useState(false);
    const kindPromotion = translate.formatKeys(promotionKindOption, ['label']);
    const typeDiscount = translate.formatKeys(discountTypeOption, ['label']);
    const statePromotion = translate.formatKeys(statePromotionOptions, ['label']);
    const {
        form,
        mixinFuncs: mixinFuncsForm,
        onValuesChange,
    } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncsForm.handleSubmit({ ...values });
    };

    const showLimit = (e) => {
        if (e === 1) {
            setShow(true);
        } else {
            setShow(false);
        }
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            state: statePromotion.find((item) => item.value == dataDetail?.state)?.label,
        });
        showLimit(dataDetail.discountType);
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
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField
                            disabled={
                                dataDetail.state == STATE_PROMOTION_CANCEL || dataDetail.state == STATE_PROMOTION_END
                            }
                            required
                            label={translate.formatMessage(message.name)}
                            name="name"
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            name="kindPromotion"
                            label={translate.formatMessage(message.kindPromotion)}
                            allowClear={true}
                            disabled={dataDetail.state !== STATE_PROMOTION_CREATED && isEditing}
                            options={kindPromotion}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            onChange={(e) => showLimit(e)}
                            required
                            disabled={dataDetail.state !== STATE_PROMOTION_CREATED && isEditing}
                            name="discountType"
                            label={translate.formatMessage(message.discountType)}
                            allowClear={true}
                            options={typeDiscount}
                        />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            required
                            disabled={dataDetail.state !== STATE_PROMOTION_CREATED && isEditing}
                            label={translate.formatMessage(message.quantity)}
                            name="quantity"
                        />
                    </Col>
                    {show ? (
                        <Col span={12}>
                            <NumericField
                                required
                                min={0}
                                max={100}
                                addonAfter={<PercentageOutlined />}
                                disabled={dataDetail.state !== STATE_PROMOTION_CREATED && isEditing}
                                label={translate.formatMessage(message.discountValue)}
                                name="discountValue"
                            />
                        </Col>
                    ) : (
                        <Col span={12}>
                            <NumericField
                                required
                                disabled={dataDetail.state !== STATE_PROMOTION_CREATED && isEditing}
                                label={translate.formatMessage(message.discountValue)}
                                name="discountValue"
                            />
                        </Col>
                    )}

                    {show && (
                        <Col span={12}>
                            <NumericField
                                disabled={dataDetail.state !== STATE_PROMOTION_CREATED && isEditing}
                                min={0}
                                label={translate.formatMessage(message.discountLimit)}
                                name="allowableLimit"
                            />
                        </Col>
                    )}

                    {/* <Col span={12}>
                        <AutoCompleteField
                            name={['serviceDto', 'id']}
                            label={translate.formatMessage(message.service)}
                            disabled={dataDetail.state !== STATE_PROMOTION_CREATED && isEditing}
                            allowClear={false}
                            apiConfig={apiConfig.service.getAutoComplete}
                            mappingOptions={(item) => ({
                                label: item.serviceName,
                                value: item.id,
                            })}
                            searchParams={(text) => ({ name: text })}
                        />
                    </Col> */}
                    <Col span={12}>
                        <DatePickerField
                            required
                            disabled={dataDetail.state !== STATE_PROMOTION_CREATED && isEditing}
                            format={DATE_FORMAT_VALUE}
                            style={{ width: '100%' }}
                            name="startDate"
                            label={translate.formatMessage(message.startDate)}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            required
                            disabled={dataDetail.state !== STATE_PROMOTION_CREATED && isEditing}
                            format={DATE_FORMAT_VALUE}
                            style={{ width: '100%' }}
                            name="endDate"
                            label={translate.formatMessage(message.endDate)}
                        />
                    </Col>
                    {isEditing && (
                        <>
                            {dataDetail.state === STATE_PROMOTION_RUNNING && (
                                <Col span={12}>
                                    <SelectField
                                        required
                                        name="state"
                                        label={translate.formatMessage(message.state)}
                                        options={statePromotion.filter((item) => item.value === STATE_PROMOTION_END)}
                                    />
                                </Col>
                            )}

                            {dataDetail.state === STATE_PROMOTION_CREATED && (
                                <Col span={12}>
                                    <SelectField
                                        required
                                        name="state"
                                        label={translate.formatMessage(message.state)}
                                        options={statePromotion.filter((item) => item.value === STATE_PROMOTION_CANCEL)}
                                    />
                                </Col>
                            )}
                        </>
                    )}
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            label={translate.formatMessage(message.description)}
                            name="description"
                            type="textarea"
                            disabled={
                                dataDetail.state == STATE_PROMOTION_CANCEL || dataDetail.state == STATE_PROMOTION_END
                            }
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">
                    {mixinFuncs.renderActions(
                        false,
                        dataDetail?.state == undefined ||
                            dataDetail?.state == STATE_PROMOTION_END ||
                            dataDetail?.state == STATE_PROMOTION_CANCEL,
                    )}
                </div>
            </Card>
        </Form>
    );
}

export default PromotionForm;
