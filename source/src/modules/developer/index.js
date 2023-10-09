import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, TIME_FORMAT_DISPLAY } from '@constants';
import apiConfig from '@constants/apiConfig';
import { levelOptionSelect } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { convertUtcToLocalTime } from '@utils';
import { Button } from 'antd';
import { ProjectOutlined } from '@ant-design/icons';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
const message = defineMessages({
    objectName: 'Lập trình viên',
    home: 'Trang chủ',
    developer: 'Lập trình viên',
    status: 'Trạng thái',
    name: 'Họ và tên',
});

const DeveloperListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.developer,
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
            funcs.additionalActionColumnButtons = () => ({
                project: ({ id, studentInfo }) => (
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                                routes.projectListPage.path +
                                    `?developerId=${id}&developerName=${studentInfo?.fullName}`,
                            );
                        }}
                    >
                        <ProjectOutlined />
                    </Button>
                ),
            });
        },
    });
    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: ['studentInfo', 'fullName'],
        },
        {
            title: 'Vai trò',
            dataIndex: ['roleInfo', 'projectRoleName'],
            width: 170,
        },
        {
            title: 'Trình độ',
            dataIndex: 'level',
            width: 100,
            render: (level) => {
                const levelLabel = levelOptionSelect.map((item) => {
                    if (level === item.value) {
                        return item.label;
                    }
                });
                return <div>{levelLabel}</div>;
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            width: 170,
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        mixinFuncs.renderActionColumn({ project: true, edit: true, delete: true }, { width: 160 }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.developer) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            ></ListPage>
        </PageWrapper>
    );
};

export default DeveloperListPage;
