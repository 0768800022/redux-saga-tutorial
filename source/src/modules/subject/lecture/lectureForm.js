import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import SelectField from '@components/common/form/SelectField';
import { lectureKindOptions } from '@constants/masterData';

const message = defineMessages({
    description: 'Mô tả chi tiết',
    lectureKind: 'Loại bài giảng',
    shortDescription: 'Mô tả Ngắn',
    lectureName: 'Tên bài giảng',
    status: 'Trạng thái',
    urlDocument: 'Đường dẫn tài liệu', 
    subjectId: 'Mã Môn học',
});


const LectureForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues,subjectId }) => {
    const translate = useTranslate();
    const lectureKindValues = translate.formatKeys(lectureKindOptions, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        values.subjectId = subjectId;
        values.status = 1;
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        dataDetail.status = 1;
        dataDetail.subjectId = subjectId;
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(message.lectureName)} name="lectureName" />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            name="lectureKind"
                            label={translate.formatMessage(message.lectureKind)}
                            allowClear={false}
                            options={lectureKindValues}
                        />
        
                    </Col>
                </Row>

                
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            name="urlDocument"
                            label={translate.formatMessage(message.urlDocument)}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            required
                            label={translate.formatMessage(message.description)}
                            name="description"
                            type="textarea"
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            required
                            label={translate.formatMessage(message.shortDescription)}
                            name="shortDescription"
                            type="textarea"
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default LectureForm;
