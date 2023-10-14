import { CheckCircleOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { stateResgistrationOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { Tag } from 'antd';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useLocation } from 'react-router-dom';
import style from './Registration.module.scss';
import { formatMoney } from '@utils';
import Avatar from 'antd';
import routes from '../routes';
const message = defineMessages({
    objectName: 'Danh sách đăng kí khóa học',
    studentId: 'Tên sinh viên',
    home: 'Trang chủ',
    courseid: 'courseId',
    createDate: 'Ngày đăng kí',
    isIntern: 'Đăng kí thực tập',
    course: 'Khóa học',
    registration: 'Danh sách sinh viên đăng kí khóa học',
    state: 'Tình trạng',
    money: ' Số tiền',
    kind: 'Loại tiền',
    history: ' Lịch sử trả phí',
});

function RegistrationMoneyListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const stateRegistration = translate.formatKeys(stateResgistrationOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseState = queryParameters.get('courseState');
    const courseStatus = queryParameters.get('courseStatus');
    // const courseStatus = queryParameters.get('courseStatus');
    //  const courseStatus = queryParameters.get('courseStatus');
    const registrationId = queryParameters.get('registrationId');
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
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
            funcs.getCreateLink = () => {
                return `${pagePath}/create?registrationId=${registrationId}&courseState=${courseState}&courseStatus=${courseStatus}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?registrationId=${registrationId}&courseState=${courseState}&courseStatus=${courseStatus}`;
            };
        },
    });
    const setColumns = () => {
        const columns = [
            {
                title: translate.formatMessage(message.studentId),
                dataIndex: ['registrationInfo', 'studentInfo', 'fullName'],
            },
            {
                title: translate.formatMessage(message.money),
                dataIndex: 'money',
                align: 'center',

                render: (price) => {
                    const formattedValue = formatMoney(price, {
                        currentcy: 'đ',
                        currentDecimal: '0',
                        groupSeparator: ',',
                    });
                    return <div>{formattedValue}</div>;
                },
            },

            {
                title: translate.formatMessage(message.kind),
                dataIndex: 'kind',
                align: 'center',

                render(kind) {
                    return kind == 1 ? (
                        <Tag>
                            <div style={{ padding: '0 4px', fontSize: 14 }}>Tiền nhận </div>
                        </Tag>
                    ) : (
                        <Tag>
                            <div style={{ padding: '0 4px', fontSize: 14 }}>Tiền trả </div>
                        </Tag>
                    );
                },
            },
        ];
        columns.push(
            mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: 110 }, { lastTitle: ' lịch sử trả phí' }),
        );
        return columns;
    };

    const searchFields = [
        {
            key: 'id',
            placeholder: translate.formatMessage(message.studentId),
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                {
                    breadcrumbName: translate.formatMessage(message.course),
                    path: '/course',
                },
                {
                    breadcrumbName: translate.formatMessage(message.registration),
                    path:
                        routes.registrationListPage.path +
                        `?registrationId=${registrationId}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`,
                },
                { breadcrumbName: translate.formatMessage(message.history) },
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
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={setColumns()}
                    />
                }
            />
        </PageWrapper>
    );
}

export default RegistrationMoneyListPage;
