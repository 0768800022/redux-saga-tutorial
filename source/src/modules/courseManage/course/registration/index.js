import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { stateResgistrationOptions, statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar, Button, Tag, Tooltip } from 'antd';
import React, { useState } from 'react';
import { Link, generatePath, useLocation, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { date } from 'yup/lib/locale';
import BaseTable from '@components/common/table/BaseTable';
import { CheckCircleOutlined, DollarOutlined, PlusSquareOutlined } from '@ant-design/icons';
import styles from './Registration.module.scss';
import { useNavigate } from 'react-router-dom';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ScheduleFile from '@components/common/elements/ScheduleFile';
import { commonMessage } from '@locales/intl';
import { convertMinuteToHour, formatMoney, formatMoneyValue } from '@utils';
import useTrainingUnit from '@hooks/useTrainingUnit';
import classNames from 'classnames';
import useDisclosure from '@hooks/useDisclosure';
import StatisticsTaskModal from '@components/common/elements/StatisticsTaskModal';
import useFetch from '@hooks/useFetch';

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
    const { trainingUnit, bugUnit, numberProject } = useTrainingUnit();
    localStorage.setItem('pathPrev', location.search);
    const navigate = useNavigate();
    const [openedStatisticsModal, handlersStatisticsModal] = useDisclosure(false);
    const [detail, setDetail] = useState([]);
    const [isTraining, setisTraining] = useState(false);
    const { execute: executeFindTracking } = useFetch(apiConfig.projectTaskLog.findAllTrackingLog, {
        immediate: false,
    });
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
    const handleOnClickProject = (record, event, value) => {
        // event.preventDefault();
        executeFindTracking({
            params: {
                courseId: record?.courseId,
                studentId: record?.studentId,
            },
            onCompleted: (res) => {
                if (res?.data) {
                    const updatedData = res.data.map((item) => ({
                        ...item,
                        courseId: record?.courseId,
                        studentId: record?.studentId,
                    }));
                    setDetail(updatedData);
                }
                handlersStatisticsModal.open();
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };
    const handleOnClickTraining = (record, event, value) => {
        // event.preventDefault();
        // executeFindTracking({
        //     params: {
        //         courseId: record?.courseId,
        //         studentId: record?.studentId,
        //     },
        //     onCompleted: (res) => {
        //         if (res?.data) {
        //             const updatedData = res.data.map((item) => ({
        //                 ...item,
        //                 courseId: record?.courseId,
        //                 studentId: record?.studentId,
        //             }));
        //             setDetail(updatedData);
        //         }
        //         handlersStatisticsModal.open();
        //     },
        //     onError: (error) => {
        //         console.log(error);
        //     },
        // });
        setisTraining(true);
        handlersStatisticsModal.open();
    };
    const handlerCancel = () => {
        setDetail([]);
        setisTraining(false);
        handlersStatisticsModal.close();
    };

    const columns = [
        {
            title: translate.formatMessage(commonMessage.studentName),
            dataIndex: ['studentName'],
            render: (studentName, record) => (
                <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                    {studentName}
                </div>
            ),
        },
        {
            title: translate.formatMessage(commonMessage.totalProject),
            align: 'center',
            // dataIndex: 'totalProject',
            render: (record) => {
                let value;
                if (record.totalTimeBug === 0 || record.totalTimeWorking === 0) {
                    value = 0;
                } else {
                    value = (record.totalTimeBug / record.totalTimeWorking - 1) * 100;
                }
                return (
                    <div
                        className={classNames(
                            record.totalProject < numberProject
                                ? styles.customPercentOrange
                                : styles.customPercentGreen,
                        )}
                    >
                        <div>
                            {record.totalProject}/{numberProject}
                        </div>
                        <div>
                            {' '}
                            {record.minusTrainingProjectMoney && value < bugUnit ? (
                                <span> Trừ: {formatMoneyValue(record.minusTrainingProjectMoney)}</span>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.rateTraining),
            align: 'center',
            render: (record) => {
                let value;
                if (record.totalLearnCourseTime === 0 || record.totalAssignedCourseTime === 0) {
                    value = 0;
                } else {
                    value = (record.totalLearnCourseTime / record.totalAssignedCourseTime - 1) * 100;
                }
                return (
                    <Tooltip
                        style={{ width: 500 }}
                        placement="bottom"
                        title={
                            <div>
                                <span style={{ display: 'block' }}>
                                    {translate.formatMessage(commonMessage.totalLearnCourseTime)}:{' '}
                                    {convertMinuteToHour(record.totalLearnCourseTime)}
                                </span>
                                <span style={{ display: 'block' }}>
                                    {translate.formatMessage(commonMessage.totalAssignedCourseTime)}:{' '}
                                    {convertMinuteToHour(record.totalAssignedCourseTime)}
                                </span>
                                <span style={{ display: 'block' }}>
                                    {translate.formatMessage(commonMessage.rateAllowable)}:{' '}
                                    {formatPercentValue(parseFloat(trainingUnit))}
                                </span>
                            </div>
                        }
                    >
                        <div
                            className={classNames(
                                styles.customDiv,
                                value > trainingUnit ? styles.customPercent : styles.customPercentOrange,
                            )}
                            onClick={(event) => handleOnClickTraining(record, event, value)}
                        >
                            {value > 0 ? (
                                <div>-{formatPercentValue(parseFloat(value))}</div>
                            ) : (
                                <div className={styles.customPercentGreen}>Tốt</div>
                            )}
                            {record.minusTrainingMoney > 0 && (
                                <span> Trừ: {formatMoneyValue(record.minusTrainingMoney)}</span>
                            )}
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.rateBug),
            align: 'center',
            render: (record) => {
                let value;
                if (record.totalTimeBug === 0 || record.totalTimeWorking === 0) {
                    value = 0;
                } else {
                    value = (record.totalTimeBug / record.totalTimeWorking - 1) * 100;
                }
                return (
                    <Tooltip
                        placement="bottom"
                        title={
                            <div>
                                <span style={{ display: 'block' }}>
                                    {translate.formatMessage(commonMessage.totalTimeBug)}:{' '}
                                    {convertMinuteToHour(record.totalTimeBug)}
                                </span>
                                <span style={{ display: 'block' }}>
                                    {translate.formatMessage(commonMessage.totalTimeWorking)}:{' '}
                                    {convertMinuteToHour(record.totalTimeWorking)}
                                </span>
                                <span style={{ display: 'block' }}>
                                    {translate.formatMessage(commonMessage.rateAllowable)}:{' '}
                                    {formatPercentValue(parseFloat(bugUnit))}
                                </span>
                            </div>
                        }
                    >
                        <div
                            className={classNames(
                                styles.customDiv,
                                value > bugUnit ? styles.customPercent : styles.customPercentOrange,
                            )}
                            onClick={(event) => handleOnClickProject(record, event, value)}
                        >
                            {value > 0 ? (
                                <div>-{formatPercentValue(parseFloat(value))}</div>
                            ) : (
                                <div className={styles.customPercentGreen}>Tốt</div>
                            )}
                            {value > bugUnit && (
                                <div>
                                    {' '}
                                    {record.minusTrainingProjectMoney ? (
                                        <span> Trừ: {formatMoneyValue(record.minusTrainingProjectMoney)}</span>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            )}
                        </div>
                    </Tooltip>
                );
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
            <StatisticsTaskModal
                open={openedStatisticsModal}
                close={() => handlerCancel()}
                detail={detail}
                isTraining={isTraining}
            />
        </PageWrapper>
    );
}

export default RegistrationListPage;
