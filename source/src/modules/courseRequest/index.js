import { TeamOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { stateCourseRequestOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { Button, Tag } from 'antd';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const message = defineMessages({
    objectName: 'Yêu cầu khoá học',
    name: 'Họ và tên',
    course: 'Khoá học',
    status: 'Trạng thái',
    state: 'Tình trạng',
    registration: 'Đăng ký',
});
const CourseRequestListPage = () => {
    const translate = useTranslate();
    const stateValues = translate.formatKeys(stateCourseRequestOptions, ['label']);
    const navigate = useNavigate();
    const { data, mixinFuncs, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.courseRequest,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.additionalActionColumnButtons = () => ({
                registration: ({ fullName }) => (
                    <BaseTooltip title={translate.formatMessage(message.registration)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                const id = 'create';
                                navigate(`/course-request/registration/${id}`, { state: { fullName } });
                            }}
                        >
                            <TeamOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });
    const columns = [
        {
            title: translate.formatMessage(message.name),
            dataIndex: 'fullName',
        },
        {
            title: translate.formatMessage(message.course),
            dataIndex: ['course', 'name'],
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            width: 200,
            render: (createdDate) => {
                const modifiedcreatedDate = convertStringToDateTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT).add(
                    7,
                    'hour',
                );
                const modifiedcreatedDateTimeString = convertDateTimeToString(modifiedcreatedDate, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedcreatedDateTimeString}</div>;
            },
            align: 'center',
        },
        {
            title: translate.formatMessage(message.state),
            dataIndex: 'state',
            align: 'center',
            width: 60,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderStatusColumn({ width: '60px' }),
        mixinFuncs.renderActionColumn({ registration: true, edit: true, delete: true }, { width: '120px' }),
    ];
    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.objectName),
                },
            ]}
        >
            <ListPage
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
};

export default CourseRequestListPage;
