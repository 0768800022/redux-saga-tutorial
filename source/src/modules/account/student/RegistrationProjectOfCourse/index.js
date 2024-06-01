import ListPage from '@components/common/layout/ListPage';
import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, AppConstants, commonStatusColor, commonStatus } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages, useIntl } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { useLocation } from 'react-router-dom';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { lectureState } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import routes from '@routes';
import { DATE_FORMAT_DISPLAY } from '@constants';
import { commonMessage } from '@locales/intl';
import styles from '../student.module.scss';
import AvatarField from '@components/common/form/AvatarField';
import { UserOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import { BaseTooltip } from '@components/common/form/BaseTooltip';

const message = defineMessages({
    objectName: 'Dự án',
    registration: 'Danh sách sinh viên đăng kí khóa học',
    status: 'Trạng thái',
    tableColumn: {
        action: {
            id: 'hook.useListBase.tableColumn.action',
            defaultMessage: 'Hành động',
        },
        status: {
            title: {
                id: 'hook.useListBase.tableColumn.status.title',
                defaultMessage: 'Trạng thái',
            },
            [commonStatus.ACTIVE]: {
                id: 'hook.useListBase.tableColumn.status.active',
                defaultMessage: 'Hoạt động',
            },
            [commonStatus.PENDING]: {
                id: 'hook.useListBase.tableColumn.status.pending',
                defaultMessage: 'Đang chờ',
            },
            [commonStatus.INACTIVE]: {
                id: 'hook.useListBase.tableColumn.status.lock',
                defaultMessage: 'Khóa',
            },
        },
    },
});

const RegistrationProjectListPage = () => {
    const translate = useTranslate();
    const intl = useIntl();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const stuId = queryParameters.get('studentId');
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseState = queryParameters.get('courseState');
    const courseStatus = queryParameters.get('courseStatus');
    const studentName = queryParameters.get('studentName');
    const registrationId = queryParameters.get('registrationId');
    const stateValues = translate.formatKeys(lectureState, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            // getList : apiConfig.student.getAllCourse,
            getList: apiConfig.registrationProject.getList,
            delete: apiConfig.registrationProject.delete,
            create: apiConfig.registrationProject.create,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?studentId=${stuId}`;
            };
            funcs.getCreateLink = (dataRow) => {
                return `${pagePath}/create?studentId=${stuId}&studentName=${studentName}&registrationId=${registrationId}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`;
            };
            funcs.prepareGetListPathParams = () => {
                return {
                    registrationId: registrationId,
                };
            };
            funcs.additionalActionColumnButtons = () => {
                return {
                    done: (dataRow) => {
                        // if (dataRow.project.status != commonStatus.PENDING ) return null;
                        return (
                            <BaseTooltip title={'Hoàn thành dự án'}>
                                <Button
                                    type="link"
                                    // onClick={(e) => {
                                    //     e.stopPropagation();
                                    //     mixinFuncs.showDeleteItemConfirm(dataRow.registration.id);
                                    // }}
                                    style={{ padding: 0 }}
                                >
                                    <CheckOutlined style={{ color: 'green' }} />
                                </Button>
                            </BaseTooltip>
                        );
                    },
                };
            };
        },
    });
    const setBreadRoutes = () => {
        const pathDefault = `?studentId=${stuId}&studentName=${studentName}`;
        const pathDefault2 = `?courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`;
        const breadRoutes = [];
        if (courseId != 'null' && courseId != null) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.course),
                path: '/course',
            });
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(message.registration),
                path: routes.registrationListPage.path + pathDefault2,
            });
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.student),
                path: routes.studentListPage.path,
            });
            breadRoutes.push({
                breadcrumbName: courseName,
                path: routes.studentCourseListPage.path + pathDefault,
            });
        }
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.registrationProject),
        });
        return breadRoutes;
    };
    const searchFields = [
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
            submitOnChanged: true,
        },
    ];
    const columns = [
        {
            title: '#',
            dataIndex: ['project', 'avatar'],
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
            title: translate.formatMessage(commonMessage.projectName),
            dataIndex: ['project', 'name'],
            render: (name, record) => <div className={styles.customDiv}>{name}</div>,
        },
        {
            title: intl.formatMessage(message.tableColumn.status.title),
            dataIndex: ['project', 'status'],
            align: 'center',
            render: (status) => (
                <Tag color={commonStatusColor[status]}>
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {intl.formatMessage(message.tableColumn.status[status])}
                    </div>
                </Tag>
            ),
        },
        mixinFuncs.renderActionColumn(
            {
                done: true,
                delete: true,
                // deleteItem: true,
            },
            { width: '120px' },
        ),
    ].filter(Boolean);
    return (
        <PageWrapper routes={setBreadRoutes()}>
            <div>
                <ListPage
                    actionBar={mixinFuncs.renderActionBar()}
                    title={<span style={{ fontWeight: 'normal', fontSize: '18px' }}>{studentName}</span>}
                    // searchForm={mixinFuncs.renderSearchForm({
                    //     fields: searchFields,
                    //     initialValues: queryFilter,
                    //     className: styles.search,
                    // })}
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
            </div>
        </PageWrapper>
    );
};

export default RegistrationProjectListPage;
