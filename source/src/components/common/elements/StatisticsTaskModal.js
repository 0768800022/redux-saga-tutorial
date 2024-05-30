import { DATE_DISPLAY_FORMAT, DEFAULT_EXCEL_DATE, storageKeys } from '@constants';
import useDisclosure from '@hooks/useDisclosure';
import { Button, Flex, Modal, Space, Tag, Tooltip } from 'antd';
import React from 'react';
import BaseTable from '../table/BaseTable';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import ListPage from '../layout/ListPage';
import { stateResgistrationOptions } from '@constants/masterData';
import { convertMinuteToHour, formatMoney, formatMoneyValue } from '@utils';
import useTrainingUnit from '@hooks/useTrainingUnit';
import styles from './modal.module.scss';
import { FileExcelOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { getData } from '@utils/localStorage';
import { showSucsessMessage } from '@services/notifyService';
import { getCacheAccessToken } from '@services/userService';
import axios from 'axios';

const StatisticsTaskModal = ({ detail, open, close }) => {
    const [openedStateTaskModal, handlersStateTaskModal] = useDisclosure(false);
    const translate = useTranslate();
    const stateRegistration = translate.formatKeys(stateResgistrationOptions, ['label']);
    const { trainingUnit, bugUnit } = useTrainingUnit();
    const userAccessToken = getCacheAccessToken();
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
            title: translate.formatMessage(commonMessage.courseName),
            dataIndex: ['courseName'],
            // render: (courseName, record) => <div>{courseName}</div>,
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
                        // className={classNames(
                        //     value > trainingUnit ? styles.customPercent : styles.customPercentOrange,
                        // )}
                        >
                            {value > 0 ? (
                                <div>-{formatPercentValue(parseFloat(value))}</div>
                            ) : (
                                <div className={styles.customPercentGreen}>Tốt</div>
                            )}
                            {record.minusTrainingMoney > 0 && (
                                <span>-{formatMoneyValue(record.minusTrainingMoney)}</span>
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
                    value = (record.totalTimeBug / record.totalTimeWorking) * 100;
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
                        // className={classNames(
                        //     value > bugUnit ? styles.customPercent : styles.customPercentOrange,
                        // )}
                        >
                            {value > 0 ? (
                                <div>-{formatPercentValue(parseFloat(value))}</div>
                            ) : (
                                <div className={styles.customPercentGreen}>Tốt</div>
                            )}
                            {record.minusTrainingProjectMoney ? (
                                <span>-{formatMoneyValue(record.minusTrainingProjectMoney)}</span>
                            ) : (
                                <></>
                            )}
                        </div>
                    </Tooltip>
                );
            },
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
    ];
    const exportToExcel = (value, nameExcel) => {
        axios({
            url: `${getData(storageKeys.TENANT_API_URL)}/v1/salary-period/export-to-excel/${value}`,
            method: 'GET',
            responseType: 'blob',
            // withCredentials: true,
            headers: {
                Authorization: `Bearer ${userAccessToken}`, // Sử dụng token từ state
            },
        })
            .then((response) => {
                // const fileName="uy_nhiem_chi";
                const date = new Date();

                const excelBlob = new Blob([response.data], {
                    type: response.headers['content-type'],
                });

                const link = document.createElement('a');

                link.href = URL.createObjectURL(excelBlob);
                link.download = `KyLuong_${nameExcel}.xlsx`;
                link.click();
                showSucsessMessage('Tạo tệp ủy nhiệm chi thành công');
            })
            .catch((error) => {
                console.log(error);
                // Xử lý lỗi tải file ở đây
            });
    };
    return (
        <Modal
            title={
                <div>
                    <Space>Thống kê các task hoàn thành</Space>
                    <Tooltip title={<FormattedMessage defaultMessage={'Export'} />}>
                        <Button
                            // disabled={state === PAYOUT_PERIOD_STATE_DONE}
                            type="link"
                            style={{ padding:0, marginTop:'-5px', marginLeft:10, display: 'table-cell', verticalAlign: 'middle' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                // exportToExcel(id, name);
                            }}
                        >
                            <FileExcelOutlined style={{ color: 'green' }} size={18} />
                        </Button>
                    </Tooltip>
                </div>
            }
            open={open}
            destroyOnClose={true}
            footer={null}
            onCancel={close}
            data={detail || {}}
            width={'50%'}
        >
            <BaseTable
                // onRow={(record, rowIndex) => ({
                //     onClick: (e) => {
                //         e.stopPropagation();
                //         handleFetchDetail(record.id);

                //         handlersPreviewModal.open();
                //     },
                // })}
                // onChange={changePagination}
                // pagination={pagination}
                // loading={loading}
                dataSource={detail}
                columns={columns}
            />
        </Modal>
    );
};

export default StatisticsTaskModal;
