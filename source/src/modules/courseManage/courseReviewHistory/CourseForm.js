import { Alert, Button, Card, Col, Empty, Form, Modal, Row, Tag } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
import CropImageField from '@components/common/form/CropImageField';
import {
    AppConstants,
    COMBO_KIND,
    LECTURE_SECTION,
    LESSON_KIND_SECTION,
    LESSON_STATE_DONE,
    LESSON_STATE_PROCESS,
    SINGLE_KIND,
    STATUS_DELETE,
    VERSION_STATE_SUBMIT,
    categoryKinds,
    versionState,
} from '@constants';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { BaseForm } from '@components/common/form/BaseForm';
import SelectField from '@components/common/form/SelectField';
import { courseKindOptions, lessonKindOptions, statusOptions } from '@constants/masterData';
import NumericField from '@components/common/form/NumericField';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import RichTextField from '@components/common/form/RichTextField';
import BaseTable from '@components/common/table/BaseTable';
import { ReactComponent as Processing } from '@assets/icons/processing.svg';
import { ReactComponent as Done } from '@assets/icons/done.svg';
import {  useNavigate } from 'react-router-dom';
import { SaveOutlined, StopOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import { UserOutlined } from '@ant-design/icons';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { formatMoney } from '@utils';
// import { VERSION_ERROR_NOT_FOUND, errorMessage } from '@constants/errorCode';
// import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import useDisclosure from '@hooks/useDisclosure';
import { showSucsessMessage } from '@services/notifyService';
// import PreviewLessonModal from './PreviewLessonModal';
const CourseDetailForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [bannerUrl, setBannerUrl] = useState(null);
    const [kindValue, setKindValue] = useState();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    // const courseKindValues = translate.formatKeys(courseKindOptions, ['label']);
    const navigation = useNavigate();
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    // const lessonKindValues = translate.formatKeys(lessonKindOptions, ['label']);
    const { execute: approveCourse, loading: loadingApprove } = useFetch(apiConfig.courseReviewHistory.approve);
    const { execute: rejectCourse, loading: loadingreject } = useFetch(apiConfig.courseReviewHistory.reject);
    // const { execute: VersionLesson, loading: loadingVersionLesseon } = useFetch(apiConfig.lessonsVersion.getLessonVersion);
    const handleApproveCourse = () => {
        approveCourse({
            data: {
                id: dataDetail?.id,
            },
            onCompleted: (res) => {
                showSucsessMessage(translate.formatMessage(commonMessage.approveSuccess));
                navigation(-1);
            },
            onError: (error) => {
                // if (error?.response?.data?.code == VERSION_ERROR_NOT_FOUND) {
                //     showErrorMessage(translate.formatMessage(errorMessage.VERSION_ERROR_NOT_FOUND));
                // }
                navigation(-1);
            },
        });
    };
    const [openCreateModal, handlersCreateModal] = useDisclosure(false);
    // const [openPreviewModal, handlersPreviewModal] = useDisclosure(false);
    const handleRejectHistoryCourse = (value) => {
        rejectCourse({
            data: {
                id: dataDetail?.id,
                // ...(refcode && { referralCode: refcode }),
            },
            onCompleted: (res) => {
                mixinFuncs.getList();
                // handlersCreateModal.close();
                showSucsessMessage(translate.formatMessage(commonMessage.rejectSuccess));

                navigation(-1);
            },
            onError: (error) => {
                // if (error?.response?.data?.code == VERSION_ERROR_NOT_FOUND) {
                //     showErrorMessage(
                //         translate.formatMessage(errorMessage.VERSION_ERROR_NOT_FOUND),
                //     );
                // }
                handlersCreateModal.close();
                navigation(-1);
            },
        });
    };
    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên bài học" />,
            dataIndex: 'name',
            render: (name, record) => {
                let styles;
                if (record?.kind != LECTURE_SECTION) {
                    styles = {
                        paddingLeft: '30px',
                    };
                } else {
                    styles = {
                        textTransform: 'uppercase',
                        fontWeight: 700,
                    };
                }

                return <div style={styles}>{name}</div>;
            },
        },
        {
            dataIndex: 'status',
            align: 'center',
            render: (status) => {
                return (
                    status == STATUS_DELETE && <Tag color={"red"}>
                        <div style={{ padding: '0 4px', fontSize: 14, textTransform: 'capitalize' }}>
                            {"Đã xóa"}
                        </div>
                    </Tag>
                );
            },
        },
        // {
        //     align: 'center',
        //     width: 80,
        //     render(dataRow) {
        //         if (dataRow?.state === LESSON_STATE_PROCESS && dataRow?.kind !== LESSON_KIND_SECTION)
        //             return (
        //                 <div>
        //                     <Processing width={'20px'} height={'20px'} />
        //                 </div>
        //             );
        //         if (dataRow?.state === LESSON_STATE_DONE && dataRow?.kind !== LESSON_KIND_SECTION)
        //             return (
        //                 <div>
        //                     <Done width={'20px'} height={'20px'} />
        //                 </div>
        //             );
        //     },
        // },

        // {
        //     title: <FormattedMessage defaultMessage="Loại" />,
        //     dataIndex: 'kind',
        //     align: 'center',
        //     width: 40,
        //     render(dataRow) {

        //         if (dataRow != LESSON_KIND_SECTION) {
        //             const kindLesson = lessonKindValues.find((item) => item?.value == dataRow);
        //             return (
        //                 <Tag color={kindLesson?.color}>
        //                     <div style={{ padding: '0 4px', fontSize: 14 }}>{kindLesson?.label}</div>
        //                 </Tag>
        //             );
        //         }

        //     },
        // },
    ];
    const uploadFile = (file, onSuccess, onError, setImageUrl) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values, avatar: avatarUrl, banner: bannerUrl });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            // fieldId: dataDetail?.field?.id,
        });
        // setKindValue(dataDetail?.kind);
        setAvatarUrl(dataDetail.course?.avatar);
        setBannerUrl(dataDetail.course?.banner);
    }, [dataDetail]);
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[0].value,
            });
        }
    }, [isEditing]);

    // const { data: courses } = useFetch(apiConfig.course.autocomplete, {
    //     immediate: true,
    //     mappingData: ({ data }) =>
    //         data.content.map((item) => ({
    //             value: item.id,
    //             label: item.name,
    //         })),
    //     params: { kind: 2 },
    // });

    // const tranferDataSource = useMemo(() => {
    //     const dataSource = [];
    //     for (let i = 0; i < courses?.length; i++) {
    //         const data = {
    //             key: courses[i].value,
    //             title: courses[i].label,
    //         };
    //         dataSource.push(data);
    //     }
    //     return dataSource;
    // }, [courses]);
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);

    const columnsCourse = [
        {
            title: '#',
            dataIndex: ['course', 'avatar'],
            align: 'center',
            width: 180,
            render: (avatar) => (
                <AvatarField
                    style={{ width: '100%', height: '80px' }}
                    shape="square"
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        { title: <FormattedMessage defaultMessage="Tên khoá học" />, dataIndex: ['course', 'name'] },
        {
            title: <FormattedMessage defaultMessage={'Giá'} />,
            width: 300,
            dataIndex: ['course', 'price'],
            align: 'right',
            render: (price) => {
                const formattedValue = formatMoney(price, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
    ];
    const [lessonData, setLessonData] = useState();
    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                {Object.keys(dataDetail).length === 0 ? (
                    <Empty></Empty>
                ) : (
                    <div>
                        {/* {dataDetail?.version?.state === VERSION_STATE_SUBMIT && (
                            <Alert
                                message={`${translate.formatMessage(commonMessage.versionChanges)} : ${dataDetail?.version?.reviewNote}`}
                                type="warning"
                                // closable
                                style={{ marginBottom: "10px" }}
                            />
                        )} */}
                        <Row gutter={16} >
                            <Col span={12}>
                                <CropImageField
                                    disabled={true}
                                    label={translate.formatMessage(commonMessage.avatar)}
                                    name={["course","avatar"]}
                                    imageUrl={avatarUrl && `${AppConstants.contentRootUrl}${avatarUrl}`}
                                    aspect={500 / 263}
                                    uploadFile={(...args) => uploadFile(...args, setAvatarUrl)}
                                />
                            </Col>
                            <Col span={12}>
                                <CropImageField
                                    disabled={true}
                                    label={<FormattedMessage defaultMessage="Banner" />}
                                    name={["course","banner"]}
                                    imageUrl={bannerUrl && `${AppConstants.contentRootUrl}${bannerUrl}`}
                                    aspect={16 / 9}
                                    uploadFile={(...args) => uploadFile(...args, setBannerUrl)}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                    readOnly
                                    required
                                    label={<FormattedMessage defaultMessage="Tên khoá học" />}
                                    name={["course","name"]}
                                />
                            </Col>
                            {/* <Col span={12}>
                                <AutoCompleteField
                                    disabled={true}
                                    readOnly
                                    required
                                    label={translate.formatMessage(commonMessage.category)}
                                    name="fieldId"
                                    apiConfig={apiConfig.category.autocomplete}
                                    mappingOptions={(item) => ({ value: item.id, label: item.name })}
                                    initialSearchParams={{ pageNumber: 0, excludeInDeveloper: true }}
                                    searchParams={(text) => ({ name: text })}
                                />
                            </Col> */}
                            {/* <Col span={12}>
                                <SelectField
                                    disabled={true}
                                    readOnly
                                    required
                                    label={<FormattedMessage defaultMessage="Loại" />}
                                    name="kind"
                                    onChange={(value) => {
                                        setKindValue(value);
                                    }}
                                    options={courseKindValues}
                                />
                            </Col> */}
                            <Col span={12}>
                                <NumericField
                                    disabled={true}
                                    readOnly
                                    label={<FormattedMessage defaultMessage="Giá" />}
                                    name={["course","fee"]}
                                    min={0}
                                    addonAfter="₫"
                                />
                            </Col>
                            <Col span={12}>
                                <NumericField
                                    disabled={true}
                                    readOnly
                                    label={<FormattedMessage defaultMessage="Phí hoàn trả" />}
                                    name={["course","returnFee"]}
                                    min={0}
                                    addonAfter="₫"
                                />
                            </Col>
                            <Col span={12}>
                                <AutoCompleteField
                                    disabled
                                    label={<FormattedMessage defaultMessage="Kiến thức" />}
                                    name={["course","knowledge","id"]}
                                    apiConfig={apiConfig.category.autocomplete}
                                    mappingOptions={(item) => ({ value: item.id, label: item?.categoryName })}
                                    searchParams={(text) => ({ name: text, kind: categoryKinds.CATEGORY_KIND_KNOWLEDGE })}
                                    initialSearchParams={{ kind:5 }}
                                />
                            </Col>
                            <Col span={12}>
                                <SelectField
                                    disabled={true}
                                    readOnly
                                    required
                                    label={<FormattedMessage defaultMessage="Status" />}
                                    name={["course","status"]}
                                    options={statusValues}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <TextField
                                    readOnly
                                    required
                                    type="textarea"
                                    label={<FormattedMessage defaultMessage="Mô tả" />}
                                    name={["course","description"]}
                                    style={{ height: 200, marginBottom: 40 }}
                                />
                            </Col>
                        </Row>
                    </div>
                )}


                {/* <Form.Item label={translate.formatMessage(commonMessage.listLesson)}>
                    <BaseTable
                        dataSource={dataDetail?.course}
                        columns={columns}
                        // onRow={(record) => ({
                        //     onClick: (e) => {
                        //         e.stopPropagation();
                        //         record?.kind != LESSON_KIND_SECTION && record?.status != STATUS_DELETE && VersionLesson({
                        //             pathParams: { id: record?.id },
                        //             onCompleted: (res) => {
                        //                 setLessonData(res?.data);
                        //                 record?.kind != LESSON_KIND_SECTION && record?.status != STATUS_DELETE && handlersPreviewModal.open();
                        //             },
                        //             onError: (error) => {
                        //                 // if (error?.response?.data?.code == VERSION_ERROR_NOT_FOUND) {
                        //                 //     showErrorMessage(
                        //                 //         translate.formatMessage(errorMessage.VERSION_ERROR_NOT_FOUND),
                        //                 //     );
                        //                 // }
                        //             },
                        //         });
                        //     },
                        // })}
                    />
                </Form.Item> */}

                <div className="footer-card-form" style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button
                        size="large"
                        danger
                        key="cancel"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigation(-1);
                        }}
                        icon={<StopOutlined />}
                    >
                        {translate.formatMessage(commonMessage.back)}
                    </Button>

                    {dataDetail?.state == versionState.VERSION_STATE_SUBMIT && (
                        <Button
                            size="large"
                            type="primary"
                            key="cancel"
                            danger
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRejectHistoryCourse();
                                // handlersCreateModal.open();
                            }}
                            icon={<CloseOutlined />}
                        >
                            {translate.formatMessage(commonMessage.reject)}
                        </Button>)
                    }
                    {dataDetail?.state == versionState.VERSION_STATE_SUBMIT && (<Button
                        size="large"
                        type="primary"
                        key="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            handleApproveCourse();
                        }}
                        icon={<CheckOutlined />}
                    >
                        {translate.formatMessage(commonMessage.approve)}
                    </Button>)}
                </div> 
            </Card>

            <Modal
                centered
                open={openCreateModal}
                onCancel={() => handlersCreateModal.close()}
                footer={null}
                title={translate.formatMessage(commonMessage.ressonReject)}
            >
                <BaseForm form={form} onFinish={handleRejectHistoryCourse} size="100%">
                    <Row>
                        <Col span={24} >
                            <TextField required name="reason" type="textarea" />
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: 'end', gap: "10px" }}>
                        <Col>
                            <Button
                                size="large"
                                danger
                                key="cancel"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlersCreateModal.close();
                                }}
                                icon={<StopOutlined />}
                            >
                                {translate.formatMessage(commonMessage.cancel)}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                size="large"
                                key="submit"
                                htmlType="submit"
                                type="primary"
                                loading={loadingreject}
                                icon={<SaveOutlined />}
                            >
                                {translate.formatMessage(commonMessage.reject)}
                            </Button>
                        </Col>
                    </Row>
                </BaseForm>
            </Modal>
            {/* <PreviewLessonModal
                open={openPreviewModal}
                onCancel={() => { handlersPreviewModal.close(); }}
                width={600}
                DetailData={lessonData}
            /> */}
        </BaseForm>

    );
};

export default CourseDetailForm;
