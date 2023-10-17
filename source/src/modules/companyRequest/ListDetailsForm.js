import { Card, Col, Row, Button, Form, Modal } from 'antd';
import React from 'react';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants/index';
import { formatDateString } from '@utils/index';
import dayjs from 'dayjs';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { useNavigate } from 'react-router-dom';
import useNotification from '@hooks/useNotification';
import { useIntl } from 'react-intl';
import { commonMessage } from '@locales/intl';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import NumericField from '@components/common/form/NumericField';
import { FormattedMessage } from 'react-intl';
import routes from '@routes';
import { useState, useEffect } from 'react';
import useDisclosure from '@hooks/useDisclosure';
import { statusOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';


const messages = defineMessages({
    objectName: 'Mô tả công việc',
    asignAllSuccess: 'Áp dụng {objectName} thành công',
});

const ListDetailsForm = ({ courseId, lectureId, setHasError, showPreview, open, onCancel, data, isEditing, id }) => {
    const translate = useTranslate();

    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const notification = useNotification();
    const intl = useIntl();
    const [listDetails, setlistDetails] = useState(null);
    const [openedSliderModal, handlersSliderModal] = useDisclosure(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);


    const {
        data: projectRoles,
        loading: getprojectRoleLoading,
        execute: executesprojectRoles,
    } = useFetch(apiConfig.projectRole.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.projectRoleName })),
    });

    const asignALl = (values) => {
        const id = 'create';
        if ( isEditing && data !== null ) {
            return navigate(`/company-request/${id}`, { state: { data: data } });
        } else 
        {
            notification({
                message:
                    intl.formatMessage(messages.asignAllSuccess, {
                        objectName: translate.formatMessage(messages.objectName),
                    }),
            });
            setlistDetails(values);
            return navigate(`/company-request/${id}`, { state: { data: values } });
        }
    };

    useEffect(() => {
        console.log(data);
        if (isEditing) {
            form.setFieldsValue({
                ...data,
                amount: data[0]?.amount,
                projectRoleId: data[0]?.projectRoleInfo?.projectRoleName,
                requirement: data[0]?.requirement,
                status: data[0]?.status,
                id: data[0]?.id,
            });
        }
        // else {
        //     const nullData = Object.keys(data).reduce((acc, key) => {
        //         acc[key] = null;
        //         return acc;
        //     }, {});
        //     nullData.action = 1;
        //     form.setFieldsValue({ ...nullData });
        // }
    }, [data, isEditing]);

    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        setShowPreviewModal(false);
    };

    const handleOk = () => {
        setShowPreviewModal(false);
    };

    return (
        <Modal title="Basic Modal"
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            disabled={isEditing}
            footer={[
                // <Button key="submit" type="primary" htmlType="submit" onClick={handleOk}>
                //     {<FormattedMessage defaultMessage="Tạo" />}
                // </Button>,
                null,
            ]}>
            <BaseForm
                form={form}
                onFinish={asignALl}
                size="100%"
                disabled={isEditing}
            >
                <Card>
                    <AutoCompleteField
                        label={<FormattedMessage defaultMessage="Vai trò" />}
                        name="projectRoleId"
                        apiConfig={apiConfig.projectRole.autocomplete}
                        mappingOptions={(item) => ({ value: item.id, label: item.projectRoleName })}
                        initialSearchParams={{}}
                        searchParams={(text) => ({ projectRoleName: text })}
                        required
                    />
                    <Row gutter={16}>
                        <Col span={12}>
                            <NumericField
                                label={<FormattedMessage defaultMessage="Số lượng" />}
                                name="amount"
                                disabled={isEditing}
                                required
                            />
                        </Col>
                        <Col span={12}>
                            <SelectField
                                label={<FormattedMessage defaultMessage="Trạng thái" />}
                                name="status"
                                options={statusValues}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <TextField
                                label={<FormattedMessage defaultMessage="Yêu cầu" />}
                                name="requirement"
                                required
                            />
                        </Col>
                    </Row>
                    <div style={{ float: 'right' }}>
                        <Button key="submit" type="primary" htmlType="submit" onClick={onCancel} disabled={isEditing}>
                            {<FormattedMessage defaultMessage="Tạo" />}
                        </Button>
                    </div>

                </Card>
            </BaseForm>
        </Modal>
    );
};

export default ListDetailsForm;
