import DropdownField from '@components/common/form/DropdownField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { currentcyPositions, datetimeFormats, formSize } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import timezone from '@constants/timezone.json';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import NumericField from '@components/common/form/NumericField';

const messages = defineMessages({
    email: 'E-mail',
    timezone: 'Múi giờ',
    currency: 'Tiền tệ',
    currencyPosition: 'Vị trí tiền tệ',
    decimalSeparator: 'Dấu thập phân',
    groupSeparator: 'Dấu cách phần nghìn',
    currencyRatio: 'Tỷ lệ tiền tệ',
    dateTimeFormat: 'Định dạng ngày giờ',
    information: 'Mô tả',
    decimalRound: 'Decimal round',
});

const GeneralSettingForm = (props) => {
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, size = 'small' } = props;
    const [otherData, setOrther] = useState({});
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const onSelectTimezone = (value, item) => {
        setOrther({
            timezone: { name: value, offset: item.offset },
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            timezone: dataDetail?.timezone ? dataDetail?.timezone.name : dataDetail?.timezone?.name,
            store_info: dataDetail?.store_info,
            currentcy_position: parseInt(dataDetail?.currentcy_position),
        });
    }, [dataDetail]);

    const translate = useTranslate();
    return (
        <Form
            style={{ width: formSize[size] ?? size }}
            id={formId}
            onFinish={(data) => mixinFuncs.handleSubmit({ ...data, ...otherData })}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <TextField label={translate.formatMessage(messages.email)} name="email_shop" required />
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={4}>
                    <TextField label={translate.formatMessage(messages.currency)} name="currentcy" />
                </Col>
                <Col span={4}>
                    <DropdownField
                        name="currentcy_position"
                        label={translate.formatMessage(messages.currencyPosition)}
                        options={currentcyPositions}
                    />
                </Col>
                <Col span={4}>
                    <NumericField name="decimal_round" label={translate.formatMessage(messages.decimalRound)} />
                </Col>
                <Col span={4}>
                    <TextField name="decimal_separator" label={translate.formatMessage(messages.decimalSeparator)} />
                </Col>
                <Col span={4}>
                    <TextField name="group_separator" label={translate.formatMessage(messages.groupSeparator)} />
                </Col>
                <Col span={4}>
                    <NumericField min={1} max={100} name="currency_ratio" label={translate.formatMessage(messages.currencyRatio)} />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <SelectField
                        onSelect={onSelectTimezone}
                        name="timezone"
                        label={translate.formatMessage(messages.timezone)}
                        options={timezone}
                        // initialValue="Africa/Abidjan"
                        // optionOther="offset"
                    />
                </Col>
                <Col span={12}>
                    <DropdownField
                        name="date_time_format"
                        initialValue="dd.MM.yyyy"
                        label={translate.formatMessage(messages.dateTimeFormat)}
                        options={datetimeFormats}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <TextField
                        type="textarea"
                        label={translate.formatMessage(messages.information)}
                        name="store_info"
                    />
                </Col>
            </Row>

            <div className="footer-card-form">{actions}</div>
        </Form>
    );
};

export default GeneralSettingForm;
