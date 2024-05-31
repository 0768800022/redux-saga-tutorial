import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { FormattedMessage } from 'react-intl';
import apiConfig from '@constants/apiConfig';
const messages = defineMessages({
    id: 'Id',
    name: 'Tên kiến thức',
    developer: 'Lập trình viên',
    description: 'Description',
    kind: 'kind',
});

const KnowledgePermissionForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing, handleFocus } = props;
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} layout="vertical" onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Lập trình viên" />}
                            name="developerId"
                            disabled={isEditing}
                            apiConfig={apiConfig.developer.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.account.fullName })}
                            // initialSearchParams={{
                            //     kind: kindOfEdu,
                            // }}
                            // optionsParams={{ kind: kindOfEdu }}
                            searchParams={(text) => ({ name: text })}
                            onFocus={handleFocus}
                            required
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};
export default KnowledgePermissionForm;
