import { Card, Checkbox, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import { statusOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import { commonMessage } from '@locales/intl';

const ProjectRoleForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues,permissions }) => {
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
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);
    const [group, setGroup] = useState([]);
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);
    const getGroupPermission = () => {
        // const { permissions } = props;
        let groups;
        if (permissions && permissions.length > 0) {
            groups = permissions.reduce((r, a) => {
                r[a.nameGroup] = [...(r[a.nameGroup] || []), a];
                return r;
            }, {});
        }
        setGroup(groups);
    };
    useEffect(() => {
        if (permissions.length !== 0) getGroupPermission();
    }, [permissions]);
    const premissionCustom = (premission) => {
        return  {
            permissionId: premission?.id,
            permissionCode: premission?.pcode,
        };
    };
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.projectRoleName)}
                            name="projectRoleName"
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={translate.formatMessage(commonMessage.status)}
                            name="status"
                            allowClear={false}
                            options={statusValues}
                        />
                    </Col>
                </Row>
                <TextField
                    width={'100%'}
                    label={translate.formatMessage(commonMessage.description)}
                    name="description"
                    type="textarea"
                />
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="permissions"
                            label={'GroupPermission'}
                            rules={[{ required: true, message: 'permission' }]}
                        >
                            <Checkbox.Group style={{ width: '100%', display: 'block' }} name="permissions">
                                {group
                                    ? Object.keys(group).map((groupName) => (
                                        <Card
                                            key={groupName}
                                            size="small"
                                            title={groupName}
                                            style={{ width: '100%', marginBottom: '4px' }}
                                        >
                                            <Row>
                                                {group[groupName].map((permission) => (

                                                    
                                                    <Col span={8} key={permission.id}>
                                                        <Checkbox value={premissionCustom(permission)}>{permission.name}</Checkbox>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Card>
                                    ))
                                    : null}
                            </Checkbox.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default ProjectRoleForm;
