import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { Button, Form, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import style from './Registration.module.scss';
const message = defineMessages({
    objectName: 'Lập trình viên',
    developer: 'Lập trình viên',
    create: {
        id: 'components.common.elements.actionBar.create',
        defaultMessage: 'Add new',
    },
    add: 'Thêm mới',
    cancel: 'Hủy bỏ',
});

function DeveloperCourseKnowledgeListPage() {
    const translate = useTranslate();
    const intl = useIntl();
    const [form] = useForm();
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseState = queryParameters.get('courseState');

    localStorage.setItem('pathPrev', location.search);
    const { execute: executeCreateKnowledgePermission } = useFetch(apiConfig.knowledgePermission.create, {
        immediate: false,
    });
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            getList: apiConfig.knowledgePermission.getList,
            create: apiConfig.knowledgePermission.create,
            update: apiConfig.knowledgePermission.update,
            delete: apiConfig.knowledgePermission.delete,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);

                mixinFuncs.handleFetchList({
                    ...params,
                    knowledgeId: courseId,
                });
            };

            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: ['developer', 'accountDto', 'avatar'],
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(commonMessage.developer),
            dataIndex: ['developer', 'accountDto', 'fullName'],
        },
        {
            title: translate.formatMessage(commonMessage.phone),
            dataIndex: ['developer', 'accountDto', 'phone'],
            width: 150,
        },
        mixinFuncs.renderActionColumn(
            {
                delete: true,
            },
            { width: '180px' },
        ),
    ].filter(Boolean);

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.knowledge),
                    path: routes.knowledgeListPage.path,
                },
                { breadcrumbName: translate.formatMessage(message.developer) },
            ]}
        >
            <ListPage
                title={
                    <span
                        style={
                            courseState != 5
                                ? { fontWeight: 'normal', fontSize: '16px' }
                                : { fontWeight: 'normal', fontSize: '16px', position: 'absolute' }
                        }
                    >
                        {courseName}
                    </span>
                }
                actionBar={
                    mixinFuncs.hasPermission([apiConfig.knowledgePermission.create?.baseURL]) && (
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button type="primary" style={style} onClick={() => setShowModal(true)}>
                                <PlusOutlined />{' '}
                                {intl.formatMessage(message.create, { objectName: message.objectName })}
                            </Button>
                        </div>
                    )
                }
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                }
            />
            <Modal
                title={<FormattedMessage defaultMessage="Thêm lập trình viên vào kiến thức" />}
                open={showModal}
                onOk={() => {
                    form.submit();
                    if (form.getFieldValue('developerId')) {
                        executeCreateKnowledgePermission({
                            data: {
                                courseId: parseInt(courseId),
                                developerId: form.getFieldValue('developerId'),
                            },
                            onCompleted: (result) => {
                                showSucsessMessage('Thêm lập trình viên vào kiến thức thành công!');
                                mixinFuncs.handleFetchList({ knowledgeId: courseId });
                                form.resetFields();
                                setShowModal(false);
                            },
                            onError: (error) => {
                                if (error.response.data.code === 'ERROR-KNOWLEDGE-PERMISSION-ERROR-0001') {
                                    showErrorMessage('Thành viên trong kiến thức đã tồn tại');
                                } else {
                                    showErrorMessage('Thêm lập trình viên vào kiến thức thất bại!');
                                }
                                form.resetFields();
                                setShowModal(false);
                            },
                        });
                    }
                }}
                okText={intl.formatMessage(message.add)}
                cancelText={intl.formatMessage(message.cancel)}
                onCancel={() => {
                    form.resetFields();
                    setShowModal(false);
                }}
            >
                <div>
                    <Form form={form}>
                        <Form.Item>
                            <AutoCompleteField
                                label={<FormattedMessage defaultMessage="Lập trình viên" />}
                                name="developerId"
                                apiConfig={apiConfig.developer.getList}
                                mappingOptions={(item) => ({ value: item.id, label: item.accountDto.fullName })}
                                searchParams={(text) => ({ name: text })}
                                required
                                initialSearchParams={{}}
                                optionsParams={{}}
                            />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </PageWrapper>
    );
}

export default DeveloperCourseKnowledgeListPage;
