import ListPage from '@components/common/layout/ListPage';
import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
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
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';

const message = defineMessages({
    objectName: 'Dự án',
});

const RegistrationProjectListPage = () => {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const stuId = queryParameters.get('studentId');
    const courseName = queryParameters.get('courseName');
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
                return `${pagePath}/create?studentId=${stuId}&studentName=${studentName}&registrationId=${registrationId}&courseName=${courseName}`;
            };
            funcs.prepareGetListPathParams = () => {
                return {
                    registrationId: registrationId,
                };
            };
            funcs.additionalActionColumnButtons = () => {
                return {
                    deleteItem: ({ buttonProps, ...dataRow }) => {
                        if (!mixinFuncs.hasPermission(apiConfig.delete?.baseURL)) return null;
                        return (
                            <Button
                                {...buttonProps}
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(dataRow.project.id);
                                }}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined style={{ color: 'red' }} />
                            </Button>
                        );
                    },
                };
            };
        },
    });
    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };
    const setBreadRoutes = () => {
        const pathDefault = `?studentId=${stuId}&studentName=${studentName}`;

        const breadRoutes = [];
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.student),
            path: routes.studentListPage.path,
        });
        if (courseName) {
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
            title: translate.formatMessage(commonMessage.startDate),
            dataIndex: ['project', 'startDate'],
            render: (startDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate)}</div>;
            },
            width: 140,
            align: 'right',
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: ['project', 'endDate'],
            render: (endDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate)}</div>;
            },
            width: 140,
            align: 'right',
        },
        {
            title: 'Tình trạng',
            dataIndex: ['project', 'state'],
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderActionColumn(
            {
                // delete: true,
                deleteItem: true,
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
