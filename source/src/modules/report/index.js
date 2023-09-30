import DateRangePickerField from '@components/common/form/DateRangePickerField';
import DropdownField from '@components/common/form/DropdownField';
import { dateFilterOptions, formSize } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import { Card, Col, Empty, Form, Spin } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.scss';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import Currency from '@components/common/elements/Currency';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import moment from 'moment';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { showErrorMessage } from '@services/notifyService';
import { chart31DaysData } from '@constants';
import useQueryParams from '@hooks/useQueryParams';
import { useLocation, useParams } from 'react-router-dom';
const messages = defineMessages({
    home: 'Home',
    dashboard: 'Dashboard',
    filter: 'Filter',
    bussinessPerformance: 'Business performance',
    Revenue: 'Revenue',
    preOrderRevenue: 'Pre-Order Revenue',
    canceledRevenue: 'Canceled Revenue',
    conversionRateReport: 'Conversion Rate Report',
    gttbInvoice: 'GTTB/ Invoice',
    canceledOrderRevenue: 'Canceled Order Revenue',
    orderFulfillmentRate: 'Order Fulfillment Rate',
    orderCancellationRate: 'Order Cancellation Rate',
    revenueFromProductReturns: 'Revenue From Product Returns',
    topProducts: 'Top Daily Best Selling Products',
    topCustomers: 'Top Highest Spending Customers',
    amount: 'Amount',
    salesRevenue: 'Sales Revenue',
    dailySuccessfulRevenue: 'Daily Successful Revenue',
    month: 'Month',
    monthlyAccumulated: 'Monthly Accumulated Results',
    rangeLimit: 'The range limit for date filtering is 31-Day',
});
function ReportListPage() {
    const translate = useTranslate();
    const dateFilterValues = translate.formatKeys(dateFilterOptions, ['label']);
    const { params: queryParams, setQueryParams, serializeParams, deserializeParams } = useQueryParams();
    const [filterType, setFilterType] = useState(2);
    const [selectedRange, setSelectedRange] = useState([]);
    const [revenueData, setRevenueData] = useState({});
    const [startValue, setStartValue] = useState(null);
    const [endValue, setEndValue] = useState(null);
    const [timeZone, setTimeZone] = useState('');

    const [paginationProduct, setPaginationProduct] = useState({
        pageSize: 10,
        total: 0,
        current: 1,
    });
    const [paginationCustomer, setPaginationCustomer] = useState({
        pageSize: 10,
        total: 0,
        current: 1,
    });
    const { pathname: pagePath } = useLocation();
    const { restaurantId } = useParams();
    function changePagination(page, type) {
        if (queryParams.get(type) != page.current) {
            queryParams.set(type, page.current);
            setQueryParams(queryParams);
            const pagingPage = parseInt(queryParams.get(type));
            if (type == 'productPage') {
                setPaginationProduct((p) => ({ ...p, current: pagingPage }));
            } else {
                setPaginationCustomer((p) => ({ ...p, current: pagingPage }));
            }
        }
    }
    const { data: storeData, execute: executeGetStoreData } = useFetch(apiConfig.restaurant.getById, {
        immediate: true,
        mappingData: (res) => {
            return res.data;
        },
        pathParams: {
            id: restaurantId,
        },
    });
    useEffect(() => {
        if (storeData && storeData?.settings) {
            let res = JSON.parse(storeData?.settings);
            setTimeZone(res?.timezone?.offset);
        }
    }, [storeData]);
    const {
        data: top50ProductsData,
        execute: executeGetTop50Products,
        loading: loadingTop50Products,
    } = useFetch(apiConfig.report.getTotalByTop50FlashSale, {
        immediate: false,
        mappingData: (res) => {
            return res.data;
        },
    });
    const {
        data: top10CustomersData,
        execute: executeGetTop10Customers,
        loading: loadingTop10Customer,
    } = useFetch(apiConfig.report.getTotalByTop10Customer, {
        immediate: false,
        mappingData: (res) => {
            return res.data;
        },
    });
    const {
        data: totalSaleByStateData,
        execute: executeGetTotalSaleByState,
        loading: loadingTotalSaleByState,
    } = useFetch(apiConfig.report.getTotalSaleByState, {
        immediate: false,
        mappingData: (res) => res.data,
    });
    const {
        data: quantityByDateData,
        execute: executeGetQuantityByDate,
        loading: loadingQuantityByDate,
    } = useFetch(apiConfig.report.getQuantityByDate, {
        immediate: false,
        mappingData: (res) => mappingChartData(res.data),
    });
    const handleOnChangeFilter = (value) => {
        setFilterType(value);
    };
    const disabledDate = (current) => {
        const today = moment();
        if (startValue) {
            const last31Days = startValue.clone().subtract(31, 'days');
            const continue31Days = startValue.clone().add(31, 'days');
            return current.isBefore(last31Days) || current.isAfter(continue31Days) || current.isAfter(today);
        }
        if (endValue) {
            const last31Days = endValue.clone().subtract(31, 'days');
            return current.isBefore(last31Days) || current.isAfter(endValue) || current.isAfter(today);
        }
        return current.isAfter(today);
    };
    const handleChangeCalender = (dates) => {
        if (dates) {
            if (dates[0]) {
                setStartValue(getTrueDate(dates[0], 'start'));
            }
            if (dates[1]) {
                setEndValue(getTrueDate(dates[1], 'end'));
            }
        } else {
            setStartValue(null);
            setEndValue(null);
        }
    };
    const handleOnBlur = (open) => {
        if (!open) {
            if (!startValue || !endValue) {
                setStartValue(null);
                setEndValue(null);
            }
        }
    };
    const handleDateChange = (dates) => {
        setSelectedRange(dates);
    };
    const getTrueDate = (day, period) => {
        if (period == 'start') {
            return day.startOf('day');
        } else if (period == 'end') {
            return day.endOf('day');
        }
    };
    const columnsTop5Products = [
        {
            title: translate.formatMessage(messages.topProducts),
            dataIndex: 'name',
            render: (data) => <span style={{ fontWeight: '500', color: 'rgb(109 61 185)' }}>{data}</span>,
        },
        { title: translate.formatMessage(messages.amount), dataIndex: 'quantity', width: '200px' },
        {
            title: translate.formatMessage(messages.salesRevenue),
            dataIndex: 'totalMoney',
            align: 'right',
            width: '200px',
            render: (data) => <Currency value={data} />,
        },
    ];
    const columnsTop5Customer = [
        {
            title: translate.formatMessage(messages.topCustomers),
            dataIndex: 'customerPhone',
            render: (data) => <span style={{ fontWeight: '500', color: 'rgb(109 61 185)' }}>{data}</span>,
        },
        { title: translate.formatMessage(messages.amount), dataIndex: 'quantity', width: '200px' },
        {
            title: translate.formatMessage(messages.salesRevenue),
            dataIndex: 'totalMoney',
            align: 'right',
            width: '200px',
            render: (data) => <Currency value={data} />,
        },
    ];
    const getDateParams = (filterType) => {
        let params = {};
        if (filterType === 1) {
            params = {
                startDay: moment().startOf('day').utc().format('DD/MM/yyyy HH:mm:ss'),
                endDay: moment().endOf('day').utc().format('DD/MM/yyyy HH:mm:ss'),
            };
        } else if (filterType === 2) {
            const currentDate = moment();
            const firstDayOfMonth = currentDate.clone().startOf('month').utc();
            params = {
                startDay: firstDayOfMonth.format('DD/MM/yyyy HH:mm:ss'),
                endDay: currentDate.endOf('day').utc().format('DD/MM/yyyy HH:mm:ss'),
            };
        } else if (filterType === 3) {
            const currentDate = moment();
            const firstDayOfLastMonth = currentDate.clone().subtract(1, 'months').startOf('month').utc();
            const lastDayOfLastMonth = currentDate.clone().subtract(1, 'months').endOf('month').utc();
            params = {
                startDay: firstDayOfLastMonth.format('DD/MM/yyyy HH:mm:ss'),
                endDay: lastDayOfLastMonth.format('DD/MM/yyyy HH:mm:ss'),
            };
        }
        return params;
    };
    const handleGetTop50Producst = (params) => {
        executeGetTop50Products({
            params: {
                timeZone,
                ...params,
            },
            onCompleted: (response) => {
                executeGetTop10Customers({
                    params: {
                        timeZone,
                        ...params,
                    },
                });
            },
            onError: (error) => {
                executeGetTop10Customers({
                    params: {
                        timeZone,
                        ...params,
                    },
                });
            },
        });
    };
    const renderLineChart = (data) => {
        return (
            <ResponsiveContainer width="100%" height="100%" className={styles.chart}>
                <LineChart
                    // width={600}
                    // height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 20,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <Legend />
                    <Line type="monotone" dataKey="done" stroke="#29a648" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="cancel" stroke="#cb0900" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="pending" stroke="#f39c14" activeDot={{ r: 8 }} />
                    <Tooltip />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="date" />
                    <YAxis />
                </LineChart>
            </ResponsiveContainer>
        );
    };
    const mappingChartData = (data) => {
        let resData = [...chart31DaysData];
        data.map((item) => {
            let date = item.date.slice(-2);
            const formattedDay = date.startsWith('0') ? date.slice(1) : date;
            let foundIndex = resData.findIndex((item) => item.date == formattedDay);
            if (foundIndex > -1) {
                resData[foundIndex] = {
                    date: formattedDay,
                    cancel: item.totalStateCancel,
                    done: item.totalStateDone,
                    pending: item.totalStatePending,
                };
            }
        });
        return resData;
    };
    useEffect(() => {
        if (timeZone != '') {
            if (filterType != 4) {
                const params = getDateParams(filterType);
                executeGetQuantityByDate({
                    params: {
                        timeZone,
                        ...params,
                    },
                });
                executeGetTotalSaleByState({
                    params: {
                        timeZone,
                        ...params,
                    },
                    onCompleted: (response) => {
                        handleGetTop50Producst(params);
                    },
                    onError: (error) => {
                        handleGetTop50Producst(params);
                    },
                });
            }
        }
    }, [filterType, timeZone]);
    useEffect(() => {
        if (filterType == 4) {
            if (selectedRange) {
                if (selectedRange[1].diff(selectedRange[0], 'days') < 31) {
                    const params = {
                        startDay: moment(getTrueDate(selectedRange[0], 'start')).utc().format('DD/MM/YYYY HH:mm:ss'),
                        endDay: moment(getTrueDate(selectedRange[1], 'end')).utc().subtract(1, 'seconds').format('DD/MM/YYYY HH:mm:ss'),
                    };
                    executeGetQuantityByDate({
                        params: {
                            timeZone,
                            ...params,
                        },
                    });
                    executeGetTotalSaleByState({
                        params: {
                            timeZone,
                            ...params,
                        },
                        onCompleted: (response) => {
                            handleGetTop50Producst(params);
                        },
                        onError: (error) => {
                            handleGetTop50Producst(params);
                        },
                    });
                } else {
                    showErrorMessage(translate.formatMessage(messages.rangeLimit));
                }
            }
        }
    }, [selectedRange,timeZone]);
    useEffect(() => {
        if (totalSaleByStateData?.length > 0) {
            setRevenueData(() => {
                let result = {
                    preOrder: '',
                    preOderAmount: '',
                    revenue: '',
                    revenueAmount: '',
                    canceled: '',
                    canceledAmount: '',
                    successRate: 'NaN',
                    canceledRate: 'NaN',
                };
                totalSaleByStateData.map((item) => {
                    if (item.state == 0) {
                        result['preOder'] = item.totalSale;
                        result['preOderAmount'] = item.quantity;
                    } else if (item.state == 1) {
                        result['revenue'] = item.totalSale;
                        result['revenueAmount'] = item.quantity;
                    } else {
                        result['canceled'] = item.totalSale;
                        result['canceledAmount'] = item.quantity;
                    }
                });
                result['successRate'] = ((result['revenueAmount'] / result['preOderAmount']) * 100).toFixed(2);
                result['canceledRate'] = ((result['canceledAmount'] / result['preOderAmount']) * 100).toFixed(2);
                return result;
            });
        }
    }, [totalSaleByStateData]);
    useEffect(() => {
        queryParams.set('productPage', 1);
        queryParams.set('customerPage', 1);
        setQueryParams(queryParams);
    }, []);
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                { breadcrumbName: translate.formatMessage(messages.dashboard) },
            ]}
        >
            <div style={{ width: 'small', padding: '0px 200px 0px 0px', overflowX: 'hidden' }}>
                <Card className={`card-form `} bordered={false}>
                    <div className={`card-form ${styles.filterWrapper}`}>
                        <span className={styles.label}>{translate.formatMessage(messages.filter)}</span>
                        <DropdownField
                            defaultValue={filterType}
                            name="dateFilter"
                            options={dateFilterValues}
                            onChange={handleOnChangeFilter}
                            style={{ marginBottom: '0px', width: '316px' }}
                        />
                        {filterType == 4 && (
                            <DateRangePickerField
                                disabledDate={disabledDate}
                                onChange={handleDateChange}
                                style={{ marginBottom: '0px' }}
                                onCalendarChange={handleChangeCalender}
                                onOpenChange={handleOnBlur}
                            />
                        )}
                    </div>
                </Card>
                <Card
                    title={
                        <span style={{ textTransform: 'uppercase' }}>
                            {translate.formatMessage(messages.bussinessPerformance)}
                        </span>
                    }
                    className={`card-form-report`}
                    style={{ marginTop: '20px' }}
                    bordered={false}
                >
                    {loadingTotalSaleByState ? (
                        <div
                            style={{
                                width: '100%',
                                height: '500px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Spin size="large" />
                        </div>
                    ) : totalSaleByStateData ? (
                        <div className={styles.reportWrapper}>
                            <div className={styles.cardInfoVertical}>
                                <span className={styles.title}>{translate.formatMessage(messages.Revenue)}</span>
                                <span className={styles.data}>
                                    <Currency value={revenueData.revenue} />
                                </span>
                                <span className={styles.desc}>
                                    {translate.formatMessage(messages.amount)} {revenueData.revenueAmount}
                                </span>
                            </div>
                            <div className={styles.cardInfoHorizon}>
                                <span className={styles.title}>
                                    {translate.formatMessage(messages.orderFulfillmentRate)}
                                </span>
                                <span className={styles.data}>{revenueData.successRate}%</span>
                                {/* <span className={styles.desc}>
                                        {translate.formatMessage(messages.monthlyAccumulated)} 200.000.000.000
                                    </span> */}
                            </div>
                            <div className={styles.cardInfoHorizon}>
                                <span className={styles.title}>
                                    {translate.formatMessage(messages.orderCancellationRate)}
                                </span>
                                <span className={styles.data}>{revenueData.canceledRate}%</span>
                                {/* <span className={styles.desc}>
                                        {translate.formatMessage(messages.month)} 200.000.000.000
                                    </span> */}
                            </div>
                            <div className={styles.cardInfoVertical}>
                                <span className={styles.title}>
                                    {translate.formatMessage(messages.preOrderRevenue)}
                                </span>
                                <span className={styles.data}>
                                    <Currency value={revenueData.preOder} />
                                </span>
                                <span className={styles.desc}>
                                    {translate.formatMessage(messages.amount)} {revenueData.preOderAmount}
                                </span>
                            </div>
                            <div className={styles.chartSection}>
                                <div className={styles.chartInfo}>
                                    <span className={styles.label}>
                                        {translate.formatMessage(messages.dailySuccessfulRevenue)}
                                    </span>
                                    <span className={styles.data}>
                                        {/* <span className={styles.dataEmphasize}>17.000.000</span> */}
                                    </span>
                                </div>
                                {renderLineChart(quantityByDateData)}
                            </div>
                            <div className={styles.cardInfoVertical}>
                                <span className={styles.title}>
                                    {translate.formatMessage(messages.canceledRevenue)}
                                </span>
                                <span className={styles.data}>
                                    <Currency value={revenueData.canceled} />
                                </span>
                                <span className={styles.desc}>
                                    {translate.formatMessage(messages.amount)} {revenueData.canceledAmount}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <Empty />
                    )}
                </Card>
                <Card className={`card-form `} bordered={false} style={{ marginTop: '20px' }}>
                    <BaseTable
                        columns={columnsTop5Products}
                        dataSource={top50ProductsData}
                        loading={loadingTop50Products}
                        rowKey={(record) => record.refObjectId}
                        pagination={paginationProduct}
                        onChange={(page) => {
                            changePagination(page, 'productPage');
                        }}
                        className="top-product-table"
                    />
                </Card>
                <Card className={`card-form `} bordered={false} style={{ marginTop: '20px' }}>
                    <BaseTable
                        columns={columnsTop5Customer}
                        dataSource={top10CustomersData}
                        loading={loadingTop10Customer}
                        rowKey={(record) => record.customerPhone}
                        pagination={paginationCustomer}
                        onChange={(page) => {
                            changePagination(page, 'customerPage');
                        }}
                        className="top-customer-table"
                    />
                </Card>
            </div>
        </PageWrapper>
    );
}

export default ReportListPage;
