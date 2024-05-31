import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE, versionState } from '@constants';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Tag } from 'antd';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { versionStateOptions } from '@constants/masterData';
import { RedoOutlined } from '@ant-design/icons';
import { EyeOutlined } from '@ant-design/icons';
const message = defineMessages({
    objectName: 'Khoá học chờ xét duyệt',

});
const CourseReviewHistoryListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const stateReviewCourse = translate.formatKeys(versionStateOptions, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            getList: apiConfig.courseReviewHistory.getList,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);

                mixinFuncs.handleFetchList({
                    ...params,
                    state: versionState.VERSION_STATE_SUBMIT,
                });

            };

            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.additionalActionColumnButtons = () => ({
                view: ({ id }) => {
                    console.log(id);
                    return (
                        <BaseTooltip title={translate.formatMessage(commonMessage.view)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {

                                    e.stopPropagation();
                                    navigate(`/course-review-history/${id}`);
                                }}
                            >
                                {<EyeOutlined style={{ color: 'blue' }} />}
                            </Button>
                        </BaseTooltip>
                    );
                },
                    

            });
        },
    });
    const columns = [
        { title: <FormattedMessage defaultMessage="Tên khoá học" />, dataIndex: ['course', 'name'] },
        { title: <FormattedMessage defaultMessage="Tên leader" />, dataIndex: ['course', 'leader', 'account', 'fullName'] },

        {
            title: <FormattedMessage defaultMessage="Tình trạng" />,
            dataIndex: 'state',
            align: 'center',
            render: (state) => {
                const versionStatus = stateReviewCourse.find((item) => item?.value == state);

                return (
                    <Tag color={versionStatus?.color}>
                        <div style={{ padding: '0 4px', fontSize: 14, textTransform: 'capitalize' }}>
                            {versionStatus?.label}
                        </div>
                    </Tag>
                );
            },
        },

        mixinFuncs.renderActionColumn({ view: true, edit: true, delete: false }, { width: '150px' }),
    ];

    const searchFields = [];

    const ButtonRefesh = () => {
        return <Button icon={<RedoOutlined />} onClick={() => mixinFuncs.getList()}>Làm mới</Button>;
    };

    return (
        <PageWrapper routes={[
            {
                breadcrumbName: translate.formatMessage(message.objectName),
            },
        ]}>
            <ListPage
                button={<ButtonRefesh />}
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                // actionBar={
                //     mixinFuncs.hasPermission(apiConfig?.course?.create.baseURL) ? mixinFuncs.renderActionBar() : null
                // }
                // actionBar={mixinFuncs.renderActionBar()}
                baseTable={

                    <BaseTable
                        style={{
                            cursor: 'pointer',
                        }}
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                        onRow={(record) => ({
                            onClick: (e) => {
                                e.stopPropagation();
                                navigate(`/courses-review/${record?.version?.id}`);
                            },
                        })}
                        objectName={translate.formatMessage(message.objectName)}

                    />
                }
            />
        </PageWrapper>
    );
};

export default CourseReviewHistoryListPage;
