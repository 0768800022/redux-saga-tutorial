import ListPage from '@components/common/layout/ListPage';
import React, { useEffect, useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    DEFAULT_FORMAT,
    DATE_FORMAT_DISPLAY,
    DEFAULT_TABLE_ITEM_SIZE,
    AppConstants,
    DATE_FORMAT_VALUE,
} from '@constants';
import { IconCategory, IconReportMoney } from '@tabler/icons-react';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { FormattedMessage, defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons';
import { Button, Avatar, Tag, Modal, Card, Row, Col, Form } from 'antd';
import { IconBrandTeams } from '@tabler/icons-react';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import routes from '@routes';
import route from '@modules/projectManage/project/projectTask/routes';
import { DollarOutlined, TeamOutlined, WomanOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { statusOptions, projectTaskState } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import styles from './index.module.scss';

// import icon_team_1 from '@assets/images/team-Members-Icon.png';

import useFetch from '@hooks/useFetch';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import useNotification from '@hooks/useNotification';
import { BaseForm } from '@components/common/form/BaseForm';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import NumericField from '@components/common/form/NumericField';
import TextField from '@components/common/form/TextField';
import useDisclosure from '@hooks/useDisclosure';
import DatePickerField from '@components/common/form/DatePickerField';
import { formatDateString } from '@utils';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
const message = defineMessages({
    objectName: 'Dự án',
});

const LectureKnowledgeListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const knowledgeId = queryParameters.get('knowledgeId');

    const [form] = Form.useForm();
    const validateDueDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: {
                getList: apiConfig.course.getDetails,
            },
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    if (response.result === true) {
                        return {
                            data: response?.data?.lectureList,
                            total: response.data.totalElements,
                        };
                    }
                };

                funcs.prepareGetListPathParams = () => {
                    return {
                        id: knowledgeId,
                    };
                };

                // funcs.changeFilter = (filter) => {
                //     const knowledgeId = queryParams.get('knowledgeId');
                //     if (knowledgeId) {
                //         mixinFuncs.setQueryParams(
                //             serializeParams({ id: knowledgeId, ...filter }),
                //         );
                //     } else {
                //         mixinFuncs.setQueryParams(serializeParams(filter));
                //     }
                // };
            },
        });

    console.log(data);

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.knowledge),
            path: routes.knowledgeListPage.path,
        },
        {
            breadcrumbName: translate.formatMessage(commonMessage.lesson),
        },
    ];
    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.projectName),
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
            submitOnChanged: true,
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
            submitOnChanged: true,
        },
    ].filter(Boolean);
    const columns = [
        {
            title: translate.formatMessage(commonMessage.lectureName),
            dataIndex: 'lectureName',
            // render: (subjectName, record) =>
            //     !record.parentId ? (
            //         <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
            //             {subjectName}
            //         </div>
            //     ) : (
            //         <div>{subjectName}</div>
            //     ),
        },
        {
            title: translate.formatMessage(commonMessage.subjectName),
            dataIndex: ['subject', 'subjectName'],
            width: 200,
        },
        {
            title: <FormattedMessage defaultMessage={'Mã môn học'}/>,
            dataIndex: ['subject', 'subjectCode'],
            width: 120,
        },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            render: (createdDate) => {
                const modifiedDate = convertStringToDateTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT).add(
                    7,
                    'hour',
                );
                const modifiedDateTimeString = convertDateTimeToString(modifiedDate, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateTimeString}</div>;
            },
            width: 180,
            align: 'right',
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        // mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                // searchForm={mixinFuncs.renderSearchForm({
                //     fields: searchFields,
                //     initialValues: queryFilter,
                //     className: styles.search,
                // })}
                // actionBar={mixinFuncs.renderActionBar()}
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

export default LectureKnowledgeListPage;
