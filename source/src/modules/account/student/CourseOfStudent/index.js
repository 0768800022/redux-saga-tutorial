import ListPage from '@components/common/layout/ListPage';
import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DATE_DISPLAY_FORMAT, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages, FormattedMessage } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { TeamOutlined, BookOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import { useNavigate, generatePath, useParams, useLocation } from 'react-router-dom';
import route from '@modules/task/routes';
import { convertDateTimeToString } from '@utils/dayHelper';
import { formSize, lectureState, stateResgistrationOptions, statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import routes from '@routes';
import { DATE_FORMAT_DISPLAY } from '@constants';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { commonMessage } from '@locales/intl';
// import styles from '../student.module.scss';
import { convertMinuteToHour, formatMoney, formatMoneyValue } from '@utils';
import ScheduleFile from '@components/common/elements/ScheduleFile';
import styles from './index.module.scss';
import useTrainingUnit from '@hooks/useTrainingUnit';
import classNames from 'classnames';

const message = defineMessages({
    objectName: 'course',
});

const CourseListPage = () => {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const paramid = useParams();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const stuId = queryParameters.get('studentId');
    const studentName = queryParameters.get('studentName');
    const leaderName = queryParameters.get('leaderName');
    const stateValues = translate.formatKeys(lectureState, ['label']);
    const { trainingUnit, bugUnit } = useTrainingUnit();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            // getList : apiConfig.student.getAllCourse,
            getList: apiConfig.registration.getList,
            delete: apiConfig.registration.delete,
            update: apiConfig.course.update,
            getById: apiConfig.course.getById,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            // funcs.prepareGetListPathParams = () => {
            //     return {
            //         // id: stuId,
            //         id : paramid.id,
            //     };
            // };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?studentId=${stuId}`;
            };
            funcs.additionalActionColumnButtons = () => ({
                registration: ({ id, courseName, state }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.registrationProject)}>
                        <Button
                            type="link"
                            // disabled={state === 1}
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();

                                navigate(
                                    routes.studentCourseRegistrationProjectListPage.path +
                                        `?studentId=${stuId}&studentName=${studentName}&registrationId=${id}&courseName=${courseName}&courseState=${state}`,
                                );
                            }}
                        >
                            <PlusSquareOutlined />
                        </Button>
                    </BaseTooltip>
                ),

                task: ({ id, name, subject, state }) => (
                    <BaseTooltip placement="bottom" title={translate.formatMessage(commonMessage.task)}>
                        <Button
                            type="link"
                            disabled={state === 1 || state === 5}
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                const path =
                                    (leaderName ? routes.leaderCourseTaskListPage.path : routes.taskListPage.path) +
                                    `?courseId=${id}&courseName=${name}&subjectId=${subject.id}&state=${state}` +
                                    (leaderName ? `&leaderName=${leaderName}` : '');
                                state !== 1 && state !== 5 && navigate(path, { state: { pathPrev: location.search } });
                            }}
                        >
                            <BookOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });

    const setBreadRoutes = () => {
        const breadRoutes = [];
        if (leaderName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.leader),
                path: routes.leaderListPage.path,
            });
        } else if (studentName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.student),
                path: routes.studentListPage.path,
            });
        }
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.course) });

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
    const stateRegistration = translate.formatKeys(stateResgistrationOptions, ['label']);
    const formatPercentValue = (value) => {
        return formatMoney(value, {
            groupSeparator: ',',
            decimalSeparator: '.',
            currentcy: '%',
            currentDecimal: '0',
        });
    };
    const columns = [
        {
            title: translate.formatMessage(commonMessage.studentName),
            dataIndex: ['courseName'],
            render: (courseName, record) => <div>{courseName}</div>,
        },
        {
            title: translate.formatMessage(commonMessage.totalProject),
            align: 'center',
            dataIndex: 'totalProject',
        },
        {
            title: translate.formatMessage(commonMessage.rateTraining),
            align: 'center',
            render: (record) => {
                let value;
                if (record.totalLearnCourseTime === 0 || record.totalAssignedCourseTime === 0) {
                    return (
                        <Tooltip
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
                                </div>
                            }
                        >
                            <div className={styles.customPercentGreen}>{formatPercentValue(0)}</div>
                        </Tooltip>
                    );
                } else {
                    value = (record.totalLearnCourseTime / record.totalAssignedCourseTime) * 100;
                    console.log(value);
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
                                </div>
                            }
                        >
                            <div
                                className={classNames(
                                    value > trainingUnit + 100 ? styles.customPercent : styles.customPercentGreen,
                                )}
                            >
                                {formatPercentValue(parseFloat(value))}
                                {record.minusTrainingMoney > 0 &&  <span> Trừ: {formatMoneyValue(record.minusTrainingMoney)}</span>  }   
                            </div>
                        </Tooltip>
                    );
                }
            },
        },
        {
            title: translate.formatMessage(commonMessage.rateBug),
            align: 'center',
            render: (record) => {
                let value;
                if (record.totalTimeBug === 0 || record.totalTimeWorking === 0) {
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
                                </div>
                            }
                        >
                            <div className={styles.customPercentGreen}>{formatPercentValue(0)}</div>

                        </Tooltip>
                    );
                } else {
                    value = (record.totalTimeBug / record.totalTimeWorking) * 100;
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
                                </div>
                            }
                        >
                            <div
                                className={classNames(
                                    value > bugUnit ? styles.customPercent : styles.customPercentGreen,
                                )}
                            >
                                {formatPercentValue(parseFloat(value))}
                                {  record.minusTrainingProjectMoney && <span> Trừ: {formatMoneyValue(record.minusTrainingProjectMoney)}</span>    }    
                            </div>
                        </Tooltip>
                    );
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
        // courseStatus == 1 &&

        mixinFuncs.renderActionColumn({ registration: true, delete: true }, { width: '120px' }),
    ];

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <div>
                <ListPage
                    title={<span style={{ fontWeight: 'normal', fontSize: '18px' }}>{studentName}</span>}
                    searchForm={mixinFuncs.renderSearchForm({
                        fields: searchFields,
                        initialValues: queryFilter,
                        className: styles.search,
                    })}
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

export default CourseListPage;
