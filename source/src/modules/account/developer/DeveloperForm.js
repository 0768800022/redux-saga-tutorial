import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import apiConfig from '@constants/apiConfig';
import { levelOptionSelect, statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';

const DeveloperForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        if (isEditing) {
            delete values.roleName;
            delete values.studentId;
        }
        if (!values.level) {
            values.level = 1;
        }
        if (!values.status) {
            values.status = 0;
        }
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>
                    <Col span={12}>
                        <AutoCompleteField
                            disabled={isEditing}
                            required
                            label={translate.formatMessage(commonMessage.studentName)}
                            name={['studentInfo', 'fullName']}
                            apiConfig={apiConfig.student.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.fullName })}
                            initialSearchParams={{ pageNumber: 0 }}
                            searchParams={(text) => ({ fullName: text })}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            defaultValue={levelOptionSelect[0]}
                            label={<FormattedMessage defaultMessage="Trình độ" />}
                            name="level"
                            options={levelOptionSelect}
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            required
                            label={translate.formatMessage(commonMessage.role)}
                            name={['roleInfo', 'id']}
                            apiConfig={apiConfig.projectRole.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.projectRoleName })}
                            initialSearchParams={{ pageNumber: 0 }}
                            searchParams={(text) => ({ fullName: text })}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            defaultValue={statusValues[0]}
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="status"
                            options={statusValues}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default DeveloperForm;
