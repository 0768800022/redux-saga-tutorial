import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import {
    AppConstants,
    DATE_FORMAT_DISPLAY,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
    TIME_FORMAT_DISPLAY,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { levelOptionSelect, statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { convertGlobImportToArray, convertUtcToLocalTime } from '@utils';
import { Avatar, Button, Modal, Row, Tag } from 'antd';
import { EyeOutlined, UserOutlined, CaretRightOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import FolderIcon from '@assets/icons';
import { FieldTypes } from '@constants/formConfig';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import useNotification from '@hooks/useNotification';
import styles from './index.module.scss';
import useAuth from '@hooks/useAuth';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';

const message = defineMessages({
    objectName: 'Tìm kiếm ứng viên',
    createSuccess: 'Lưu ứng viên thành công',
    preview: 'Xem chi tiết ứng viên',
    saveCandidate: 'Lưu ứng viên',
    description: 'Mô tả',
    position: 'Vị trí',
    teamSize: 'Số lượng nhóm',
    projectDone: 'Dự án đã thực hiện',
    team: 'nhóm',
    reminderMessage: 'Vui lòng nhập giá trị cần tìm !',
});

const CompanySeekDevListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const [hasError, setHasError] = useState(false);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const notification = useNotification();
    const queryParameters = new URLSearchParams(window.location.search);
    const roleId = queryParameters.get('roleId');
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const { data, mixinFuncs, loading, pagination, queryFiter, serializeParams } = useListBase({
        apiConfig: {
            getList: apiConfig.companySeek.getListDev,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(serializeParams(filter));
            };
            funcs.additionalActionColumnButtons = () => ({
                preview: ({ id }) => (
                    <BaseTooltip title={translate.formatMessage(message.preview)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                executeGetDev({
                                    pathParams: {
                                        id,
                                    },
                                    onCompleted: () => setShowPreviewModal(true),
                                    onError: () =>
                                        notification({
                                            type: 'error',
                                            title: 'Error',
                                        }),
                                });
                            }}
                        >
                            <EyeOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });
    const {
        execute: executeGetDev,
        loading: getdetailDevLoading,
        data: detailDevPreview,
    } = useFetch(apiConfig.companySeek.getByIdDev, {
        immediate: false,
    });
    const {
        data: projectRoles,
        // loading: getcompanyLoading,
        execute: executesProjectRoles,
    } = useFetch(apiConfig.projectRole.autocomplete, {
        immediate: true,
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.id,
                label: item.projectRoleName,
            })),
    });
    const { execute: executeCreateCompanySeek } = useFetch(apiConfig.companySeek.create, {
        immediate: false,
    });
    const searchFields = [
        {
            key: 'roleId',
            placeholder: translate.formatMessage(commonMessage.role),
            type: FieldTypes.SELECT,
            options: projectRoles,
        },
    ];
    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
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
            title: 'Họ và tên',
            dataIndex: 'name',
        },
        {
            title: 'Vai trò',
            dataIndex: 'projectRoles',
            width: 170,
            render: (item) => {
                let roleName = '';
                item.map((role) => {
                    if (roleName !== '') {
                        roleName += ', ';
                    }
                    roleName += role.projectRoleName;
                });
                return <div>{roleName}</div>;
            },
        },
        mixinFuncs.renderActionColumn({ preview: true }, { width: 160 }),
    ];
    const { profile } = useAuth();

    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(message.objectName) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
                baseTable={
                    <div>
                        {!roleId && <div style={{ color: 'red' }}>{translate.formatMessage(message.reminderMessage)}</div>}
                        <BaseTable
                            onChange={mixinFuncs.changePagination}
                            columns={columns}
                            dataSource={roleId && !loading ? data : null}
                            loading={loading}
                            pagination={pagination}
                        />
                    </div>
                }
            ></ListPage>
            <Modal
                // title={<FormattedMessage defaultMessage="{title}" values={{ title: newsPreview?.newsTitle }} />}
                width={800}
                open={showPreviewModal}
                centered
                onCancel={() => setShowPreviewModal(false)}
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() =>
                            executeCreateCompanySeek({
                                data: {
                                    companyId: profile?.id,
                                    developerId: detailDevPreview?.data.id,
                                    roleId: roleId || detailDevPreview?.data?.projectRoleList[0]?.id,
                                },
                                onCompleted: () => {
                                    notification({
                                        message: translate.formatMessage(message.createSuccess),
                                    });
                                    setShowPreviewModal(false);
                                },
                                onError: (err) => {
                                    notification({
                                        message: err.message,
                                    });
                                },
                            })
                        }
                    >
                        {translate.formatMessage(message.saveCandidate)}
                    </Button>,
                ]}
            >
                <Row style={{ alignItems: 'center' }}>
                    <AvatarField
                        size={64}
                        icon={<UserOutlined />}
                        src={
                            detailDevPreview?.data?.avatar
                                ? `${AppConstants.contentRootUrl}${detailDevPreview?.data?.avatar}`
                                : null
                        }
                    />
                    <div className={styles.title}>{detailDevPreview?.data?.name}</div>
                </Row>
                <div className={styles.titleProject}>{translate.formatMessage(message.projectDone)} :</div>
                {detailDevPreview?.data?.projectList &&
                    detailDevPreview?.data?.projectList.map((project) => {
                        const startDateConvert = convertStringToDateTime(
                            project?.startDate,
                            DEFAULT_FORMAT,
                            DATE_FORMAT_DISPLAY,
                        );
                        const startDate = convertDateTimeToString(startDateConvert, DATE_FORMAT_DISPLAY);
                        const endDateConvert = convertStringToDateTime(
                            project?.endDate,
                            DEFAULT_FORMAT,
                            DATE_FORMAT_DISPLAY,
                        );
                        const endDate = convertDateTimeToString(endDateConvert, DATE_FORMAT_DISPLAY);
                        return (
                            <div key={project?.id}>
                                <Row>
                                    <CaretRightOutlined />
                                    <div className={styles.name}>
                                        {project?.name} ({startDate} - {endDate})
                                    </div>
                                </Row>
                                <div className={styles.detail}>
                                    • {translate.formatMessage(message.description)}:{' '}
                                    <span className={styles.item}>{project?.description}</span>
                                </div>
                                <div className={styles.detail}>
                                    • {translate.formatMessage(message.teamSize)}:{' '}
                                    <span className={styles.item}>
                                        {project?.teamSize} {translate.formatMessage(message.team)}
                                    </span>
                                </div>
                                <div className={styles.detail}>
                                    • {translate.formatMessage(message.position)}:{' '}
                                    <span className={styles.item}>{project?.projectRole?.projectRoleName}</span>
                                </div>
                            </div>
                        );
                    })}
            </Modal>
        </PageWrapper>
    );
};

export default CompanySeekDevListPage;
