import { UserTypes } from '@constants';
import { commonMessage } from '@locales/intl';
import { notification } from 'antd';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    doneTaskDescription: 'Bạn vừa hoàn thành task: ',
    studentNewTaskDescription: 'Bạn vừa được giao task: ',
    cancelTaskDescription: 'Bạn vừa bị huỷ task : ',
    leaderNewTaskDescription: 'Một task mới vừa được tạo: ',
});

export const webSocket = (tokenLogin, kindUser, translate) => {
    var wsUri = process.env.REACT_APP_WEB_SOCKET_URL;
    var websocket;
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            // Mở lại kết nối WebSocket nếu trạng thái của trang là "visible"
            if (!websocket || websocket.readyState === WebSocket.CLOSED) {
                webSocket();
            }
        }
    });

    function init() {
        webSocket();
        setInterval(() => {
            doPing();
        }, 30000);
    }
    function webSocket() {
        websocket = new WebSocket(wsUri);

        websocket.onopen = onOpen;

        websocket.onclose = onClose;

        websocket.onmessage = onMessage;

        websocket.onerror = onError;
    }
    function onOpen(evt) {
        console.log('CONNECTED');

        var client_info = {
            cmd: 'CLIENT_INFO',
            platform: 0,
            clientVersion: '1.0',
            lang: 'vi',
            token: tokenLogin,
            app: 'CLIENT_APP',
            data: {
                app: 'CLIENT_APP',
            },
        };
        doSend(JSON.stringify(client_info));
    }

    function onClose(evt) {
        console.log('DISCONNECTED');
    }

    function onMessage(evt) {
        console.log(kindUser);
        const data = JSON.parse(evt?.data)?.data;
        if (JSON.stringify(data) !== '{}') {
            const dataNotification = JSON.parse(data?.message);
            if (kindUser == UserTypes.STUDENT){
                if (data?.kind == 1) {
                    notification.success({
                        message: translate.formatMessage(commonMessage.doneTaskTitle),
                        description: translate.formatMessage(messages.doneTaskDescription) + dataNotification?.taskName,
                    });
                } else if (data?.kind == 2) {
                    notification.info({
                        message: translate.formatMessage(commonMessage.newTaskTitle),
                        description:
                            translate.formatMessage(messages.studentNewTaskDescription) + dataNotification?.taskName,
                    });
                } else {
                    notification.error({
                        message: translate.formatMessage(commonMessage.cancelTaskTitle),
                        description:
                            translate.formatMessage(messages.cancelTaskDescription) + dataNotification?.taskName,
                    });
                }
            } else if (kindUser == UserTypes.LEADER){
                console.log('eworo');
                if (data?.kind == 2) {
                    notification.info({
                        message: translate.formatMessage(commonMessage.newTaskTitle),
                        description:
                            translate.formatMessage(messages.leaderNewTaskDescription) + dataNotification?.taskName,
                    });
                } 
            }
            localStorage.setItem('hasNotification', true);
        }
        console.log(data);
        //websocket.close();
    }
    function onError(evt) {
        console.log(evt.data);
    }

    function doSend(message) {
        // console.log('SENT: ' + message);
        if (websocket.readyState === WebSocket.OPEN) {
            websocket.send(message);
        } else {
            console.error('WebSocket is in CLOSING or CLOSED state.');
        }
    }
    function doReceived(message) {
        return message;
    }

    function doPing() {
        var pingRequest = {
            cmd: 'CLIENT_PING',
            platform: 0,
            clientVersion: '1.0',
            lang: 'vi',
            token: tokenLogin,
            app: 'CLIENT_APP',
            data: {
                app: 'CLIENT_APP',
            },
        };
        doSend(JSON.stringify(pingRequest));
    }
    init();
};
