import { Col, Row, Table, Tag } from 'antd';
import React from 'react';
import styles from './ScheduleTable.module.scss';
import TimePickerField from '../form/TimePickerField';
import { TIME_FORMAT_DISPLAY } from '@constants';
import dayjs from 'dayjs';
import BaseTable from './BaseTable';

const columns = [
    {
        title: 'Thứ',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        width: '10%',
        className: styles.customColumn,
    },
    {
        title: 'Khung giờ',
        dataIndex: 'time',
        key: 'date',
        align: 'center',
        width: '90%',
        className: styles.customColumn,
        render: (time) => {
            const timeRanges = time.split('|');
            return (
                <Row gutter={12} style={{ marginTop: 10 }}>
                    {timeRanges.map((item, index) => {
                        const timeSingle = item.split('-');
                        return (
                            <div key={item}>
                                <div style={{ textAlign: 'left', paddingLeft: '22px' }}>Frame {index + 1}</div>
                                <Row>
                                    <Col span={12}>
                                        <TimePickerField
                                            value={dayjs(timeSingle[0], TIME_FORMAT_DISPLAY)}
                                            width={'60%'}
                                            style={{ width: '90px', marginLeft: '10px' }}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <TimePickerField
                                            value={dayjs(timeSingle[1], TIME_FORMAT_DISPLAY)}
                                            width={'60%'}
                                            style={{ width: '90px', marginLeft: '10px' }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        );
                    })}
                </Row>
            );
        },
    },
];
const ScheduleTable = ({ data }) => {
    console.log(data);
    const dataSource = [
        {
            key: '1',
            date: 'Thứ 2',
            time: '12:06-12:30|15:20-17:30',
        },
        {
            key: '2',
            date: 'Thứ 3',
            time: '12:06-12:30|15:20-17:30',
        },
        {
            key: '3',
            date: 'Thứ 4',
            time: '12:06-12:30|15:20-17:30',
        },
        {
            key: '4',
            date: 'Thứ 5',
            time: '12:06-12:30|15:20-17:30',
        },
        {
            key: '5',
            date: 'Thứ 6',
            time: '12:06-12:30|15:20-17:30',
        },
        {
            key: '6',
            date: 'Thứ 7',
            time: '12:06-12:30|15:20-17:30',
        },
        {
            key: '7',
            date: 'Chủ nhật',
            time: '12:06-12:30|15:20-17:30',
        },
    ];
    return (
        <BaseTable
            dataSource={dataSource}
            columns={columns}
            bordered
            pagination={false}
            className={styles.customColumn}
        />
    );
};

export default ScheduleTable;
