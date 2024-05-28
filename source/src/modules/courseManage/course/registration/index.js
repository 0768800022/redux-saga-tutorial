import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { stateResgistrationOptions, statusOptions } from '@constants/masterData';
import useDrapDropTableItem from '@hooks/useDrapDropTableItem';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar, Button, Tag } from 'antd';
import React from 'react';
import { Link, generatePath, useLocation, useParams } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { defineMessages } from 'react-intl';
import { date } from 'yup/lib/locale';
import BaseTable from '@components/common/table/BaseTable';
import { CheckCircleOutlined, DollarOutlined, PlusSquareOutlined } from '@ant-design/icons';
import style from './Registration.module.scss';
import { useNavigate } from 'react-router-dom';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import routers from './routes';
import ScheduleFile from '@components/common/elements/ScheduleFile';
import { commonMessage } from '@locales/intl';
import { formatMoney } from '@utils';
import useTrainingUnit from '@hooks/useTrainingUnit';
import classNames from 'classnames';

const message = defineMessages({
    objectName: 'Đăng kí khoá học',
    registration: 'Danh sách sinh viên đăng kí khóa học',
    money: 'Thanh Toán',
});

function RegistrationListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const location = useLocation();
    const stateRegistration = translate.formatKeys(stateResgistrationOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseState = queryParameters.get('courseState');
    const courseStatus = queryParameters.get('courseStatus');
    const trainingUnit = useTrainingUnit();
    localStorage.setItem('pathPrev', location.search);
    const navigate = useNavigate();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.registration,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
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
            funcs.getCreateLink = () => {
                return `${pagePath}/create?courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`;
            };

            funcs.additionalActionColumnButtons = () => ({
                money: ({ id, name, status }) => (
                    <BaseTooltip title={translate.formatMessage(message.money)}>
                        <Button
                            type="link"
                            style={{ padding: '0' }}
                            disabled={status === -1}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.registrationMoneyListPage.path +
                                        `?registrationId=${id}&projectName=${name}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`,
                                );
                            }}
                        >
                            <DollarOutlined />
                        </Button>
                    </BaseTooltip>
                ),
                registration: ({ id, studentId, studentName }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.registrationProject)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.courseRegistrationProjectListPage.path +
                                        `?registrationId=${id}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}&studentId=${studentId}&studentName=${studentName}
                                            `,
                                );
                            }}
                        >
                            <PlusSquareOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(
            routes.studentActivityCourseListPage.path +
                `?courseId=${record?.courseId}&studentId=${record?.studentId}&studentName=${record?.studentName}`,
        );
    };

    const columns = [
        {
            title: translate.formatMessage(commonMessage.studentName),
            dataIndex: ['studentName'],
            render: (studentName, record) => (
                <div onClick={(event) => handleOnClick(event, record)} className={style.customDiv}>
                    {studentName}
                </div>
            ),
        },
        {
            title: 'Tỉ lệ project ',
            align: 'center',
            dataIndex: 'totalProject',
            // render: (record) => {
            //     let value;
            //     if (record.totalTimeWorking === 0) {
            //         return <div>{formatPercentValue(0)}</div>;
            //     }
            //     else {
            //         value = record.totalProject/record.totalTimeWorking*100;
            //         return <div>{formatPercentValue(parseFloat(value))}</div>;
            //     }
            // },
        },
        {
            title: 'Tỉ lệ traning ',
            align: 'center',
            render: (record) => {
                let value;
                if (record.totalAssignedCourseTime === 0) {
                    return <div>{formatPercentValue(0)}</div>;
                } else {
                    value = (record.totalLearnCourseTime / record.totalAssignedCourseTime - 1) * 100;
                    return (
                        <div className={classNames(value > trainingUnit && style.customPercent)}>
                            {formatPercentValue(parseFloat(value))}
                        </div>
                    );
                }
            },
        },
        {
            title: 'Tỉ lệ bug ',
            align: 'center',
            render: (record) => {
                let value;
                if (record.totalTimeWorking === 0) {
                    return <div>{formatPercentValue(0)}</div>;
                } else {
                    value = (record.totalTimeBug / record.totalTimeWorking) * 100;
                    return <div>{formatPercentValue(parseFloat(value))}</div>;
                }
            },
        },
        {
            title: 'Lịch trình',
            dataIndex: 'schedule',
            align: 'center',
            render: (schedule) => {
                return <ScheduleFile schedule={schedule} />;
            },
            width: 180,
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateRegistration.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        courseStatus == 1 &&
            mixinFuncs.renderActionColumn(
                {
                    registration: mixinFuncs.hasPermission([apiConfig.registrationProject.getList?.baseURL]),
                    money: mixinFuncs.hasPermission([apiConfig.registrationMoney.getList?.baseURL]),
                    edit: true,
                    delete: true,
                },
                { width: 180 },
            ),
    ].filter(Boolean);

    const searchFields = [
        {
            key: 'id',
            placeholder: translate.formatMessage(commonMessage.studentName),
        },
    ];

    const formatPercentValue = (value) => {
        return formatMoney(value, {
            groupSeparator: ',',
            decimalSeparator: '.',
            currentcy: '%',
            currentDecimal: '0',
        });
    };

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.course),
                    path: '/course',
                },
                { breadcrumbName: translate.formatMessage(message.registration) },
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
                actionBar={courseState == 5 && courseStatus == 1 && mixinFuncs.renderActionBar()}
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
        </PageWrapper>
    );
}

export default RegistrationListPage;
