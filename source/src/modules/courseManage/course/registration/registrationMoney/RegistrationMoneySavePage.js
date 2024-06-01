import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import React from 'react';
import { defineMessages } from 'react-intl';
import RegistrationMoneyForm from './RegistrationMoneyForm';
import { useLocation } from 'react-router-dom';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
// import routes from '@modules/course/routes';

const messages = defineMessages({
    objectName: 'Lịch sử trả phí',
    registration: 'Danh sách sinh viên đăng kí khóa học',
});

function RegistrationMoneySavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const registrationId = queryParameters.get('registrationId');
    const courseState = queryParameters.get('courseState');
    const courseStatus = queryParameters.get('courseStatus');
    const { pathname: pagePath } = useLocation();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.registrationMoney.getById,
            create: apiConfig.registrationMoney.create,
            update: apiConfig.registrationMoney.update,
        },
        options: {
            getListUrl: `${routes.registrationMoneyListPage.path}?registrationId=${registrationId}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`,
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    registrationId: registrationId,
                    status: 1,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    registrationId: registrationId,
                };
            };
            funcs.onSaveError = (err) => {
                if (err.response.data.code === 'ERROR-REGISTRATION-MONEY-HISTORY-ERROR-0003') {
                    showErrorMessage('Tiền hoàn lại không được cao hơn tiền thực nhận');
                    mixinFuncs.setSubmit(false);
                } else if(err.response.data.code === 'ERROR-REGISTRATION-MONEY-HISTORY-ERROR-0004') {
                    showErrorMessage('Tiền nhận không được vượt quá tiền của khoá học');
                    mixinFuncs.setSubmit(false);
                }
                else{
                    mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                    mixinFuncs.setSubmit(false);
                }
            };
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.course), path: routes.courseListPage.path },
                {
                    breadcrumbName: translate.formatMessage(messages.registration),
                    path:
                        routes.registrationListPage.path +
                        `?courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`,
                },
                {
                    breadcrumbName: translate.formatMessage(commonMessage.moneyHistory),
                    path:
                        routes.registrationMoneyListPage.path +
                        `?registrationId=${registrationId}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <RegistrationMoneyForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                isError={errors}
            />
        </PageWrapper>
    );
}

export default RegistrationMoneySavePage;
