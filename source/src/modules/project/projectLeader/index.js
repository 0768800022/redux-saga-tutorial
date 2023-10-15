import ListPage from '@components/common/layout/ListPage';
import React, { useEffect, useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons';
import { Button, Avatar, Tag } from 'antd';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import routes from '@routes';
import route from '@modules/projectTask/routes';
import { BookOutlined, TeamOutlined } from '@ant-design/icons';
import { statusOptions, projectTaskState } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';

const message = defineMessages({
    objectName: 'dự án',
    code: 'Mã dự án',
    id: 'Id',
});

const ProjectLeaderListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const developerId = queryParameters.get('developerId');
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const leaderName = queryParameters.get('leaderName');
    const developerName = queryParameters.get('developerName');
    const [dataApply, setDataApply] = useState([]);
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: {
                getList: apiConfig.project.getListLeader,
                getById: apiConfig.project.getById,
                delete: apiConfig.project.delete,
            },
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                };

                funcs.changeFilter = (filter) => {
                    const leaderId = queryParams.get('leaderId');
                    const leaderName = queryParams.get('leaderName');
                    const developerId = queryParams.get('developerId');
                    const developerName = queryParams.get('developerName');
                    if (leaderId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ leaderId: leaderId, leaderName: leaderName, ...filter }),
                        );
                    } else if (developerId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ developerId: developerId, developerName: developerName, ...filter }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(serializeParams(filter));
                    }
                };
            },
        });

    const setBreadRoutes = () => {
        const breadRoutes = [];
        if (leaderName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.leader),
                path: routes.leaderListPage.path,
            });
        } else if (developerName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.developer),
                path: routes.developerListPage.path,
            });
        }
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.project) });

        return breadRoutes;
    };
    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };

    const setColumns = () => {
        const columns = [
            {
                title: '#',
                dataIndex: 'avatar',
                align: 'center',
                width: 80,
                render: (avatar) => (
                    <AvatarField
                        size="large"
                        icon={<UserOutlined />}
                        src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                    />
                ),
            },
            {
                title: translate.formatMessage(commonMessage.name),
                dataIndex: 'name',
            },
            {
                title: translate.formatMessage(commonMessage.leader),
                dataIndex: ['leaderInfo', 'leaderName'],
                width: 150,
            },
            {
                title: translate.formatMessage(commonMessage.startDate),
                dataIndex: 'startDate',
                render: (startDate) => {
                    return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate)}</div>;
                },
                width: 140,
                align: 'center',
            },
            {
                title: translate.formatMessage(commonMessage.endDate),
                dataIndex: 'endDate',
                render: (endDate) => {
                    return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate)}</div>;
                },
                width: 140,
                align: 'center',
            },
            {
                title: 'Tình trạng',
                dataIndex: 'state',
                align: 'center',
                width: 120,
                render(dataRow) {
                    const state = stateValues.find((item) => item.value == dataRow);
                    return (
                        <Tag color={state.color}>
                            <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                        </Tag>
                    );
                },
            },

            mixinFuncs.renderStatusColumn({ width: '120px' }),
        ];

        return columns;
    };
    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                title={<span style={{ fontWeight: 'normal' }}>{leaderName || developerName}</span>}
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
};

export default ProjectLeaderListPage;
