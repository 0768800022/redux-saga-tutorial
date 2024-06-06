import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import {} from '@constants';
import apiConfig from '@constants/apiConfig';
import { stateResgistrationOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { formatMoney } from '@utils';
import { Col, Row, Tag } from 'antd';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import routes from '../routes';
import dayjs from 'dayjs';
import styles from './Registration.module.scss';
import { projectTaskState, statusOptions, registrationMoneyKind } from '@constants/masterData';
import { commonMessage } from '@locales/intl';
import {
    AppConstants,
    DATE_DISPLAY_FORMAT,
    DATE_FORMAT_DISPLAY,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
} from '@constants';
import useMoneyUnit from '@hooks/useMoneyUnit';
import useFetch from '@hooks/useFetch';
const message = defineMessages({
    objectName: 'Lịch sử trả phí',
    registration: 'Danh sách sinh viên đăng kí khóa học',
    money: ' Số tiền',
    kind: 'Loại tiền',
    history: ' Lịch sử trả phí',
});

function RegistrationMoneyListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const stateRegistration = translate.formatKeys(stateResgistrationOptions, ['label']);
    const registrationMoneyKindValues = translate.formatKeys(registrationMoneyKind, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseState = queryParameters.get('courseState');
    const courseStatus = queryParameters.get('courseStatus');
    // const courseStatus = queryParameters.get('courseStatus');
    //  const courseStatus = queryParameters.get('courseStatus');
    const registrationId = queryParameters.get('registrationId');
    const moneyUnit = useMoneyUnit();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.registrationMoney,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data,
                            total: response.data.registrationMoneyHistories.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
            funcs.getCreateLink = () => {
                return `${pagePath}/create?registrationId=${registrationId}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}&courseFee=${data?.totalMoney?.courseFee}&totalMoneyInput=${data?.totalMoney?.totalMoneyInput}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?registrationId=${registrationId}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}&courseFee=${data?.totalMoney?.courseFee}`;
            };
        },
    });

    const columns = [
        
        // {
        //     title: '#',
        //     dataIndex: ['registrationInfo', 'studentInfo', 'account', 'avatar'],
        //     align: 'center',
        //     width: 80,
        //     render: (avatar) => (
        //         <AvatarField
        //             size="large"
        //             icon={<UserOutlined />}
        //             src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
        //         />
        //     ),
        // },
    
        // {
        //     title: translate.formatMessage(commonMessage.studentName),
        //     dataIndex: ['registrationInfo', 'studentInfo', 'account', 'fullName'],
        // },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            render: (createdDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(createdDate, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            width: 130,
            // align: 'right',
        },
        {
            title: translate.formatMessage(message.money),
            dataIndex: 'money',
            align: 'right',

            render: (price) => {
                const formattedValue = formatMoney(price, {
                    currentcy: 'đ',
                    currentDecimal: '0',
                    groupSeparator: ',',
                });
                return <div>{formattedValue}</div>;
            },
            width: 130,
        },
       

        {
            title: translate.formatMessage(message.kind),
            dataIndex: 'kind',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = registrationMoneyKindValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },

        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: false, delete: true }, { width: 110 }),
    ];

    const searchFields = [
        {
            key: 'id',
            placeholder: translate.formatMessage(commonMessage.studentName),
        },
    ];

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.course),
                    path: '/course',
                },
                {
                    breadcrumbName: translate.formatMessage(message.registration),
                    path:
                        routes.registrationListPage.path +
                        `?registrationId=${registrationId}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`,
                },
                { breadcrumbName: translate.formatMessage(commonMessage.moneyHistory) },
            ]}
        >
            <ListPage
                title={
                    <>
                        {data?.registrationMoneyHistories  && <span
                            style={
                                courseState != 5
                                    ? { fontWeight: 'normal', fontSize: '16px' }
                                    : { fontWeight: 'normal', fontSize: '16px', position: 'absolute' }
                            }
                        >
                            123
                            {data?.registrationMoneyHistories?.registrationInfo?.studentInfo?.account?.fullName} - {courseName}
                        </span>}
                        <ul className={styles.groupTotal}>
                            <li className={styles.totalItem}>
                                <FormattedMessage defaultMessage="Giá khóa học" />
                                <div>
                                    {formatMoney(data?.totalMoney?.courseFee, {
                                        currentcy: 'đ',
                                        currentDecimal: '0',
                                        groupSeparator: ',',
                                    })}
                                </div>
                            </li>
                            <li className={styles.totalItem}>
                                <FormattedMessage defaultMessage="Tiền thực nhận" />
                                <div>
                                    {formatMoney(data?.totalMoney?.totalMoneyReturn, {
                                        currentcy: 'đ',
                                        currentDecimal: '0',
                                        groupSeparator: ',',
                                    })}
                                </div>
                            </li>
                            <li className={styles.totalItem}>
                                <FormattedMessage defaultMessage="Tổng tiền nhận" />
                                <div>
                                    {formatMoney(data?.totalMoney?.totalMoneyInput, {
                                        currentcy: 'đ',
                                        currentDecimal: '0',
                                        groupSeparator: ',',
                                    })}
                                </div>
                            </li>
                            <li style={{ paddingRight: '20px' }}>
                                <FormattedMessage defaultMessage="Tổng tiền hoàn trả" />
                                <div>
                                    {formatMoney(data?.totalMoney?.totalMoneyReturn, {
                                        currentcy: 'đ',
                                        currentDecimal: '0',
                                        groupSeparator: ',',
                                    })}
                                </div>
                            </li>
                        </ul>
                    </>
                }
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data.registrationMoneyHistories?.content}
                        columns={columns}
                    />
                }
            />
        </PageWrapper>
    );
}

export default RegistrationMoneyListPage;
