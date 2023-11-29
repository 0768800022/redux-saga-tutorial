import { IconFlower } from '@tabler/icons-react';
import { notification } from 'antd';

export const webSocket = (tokenLogin) => {
    var wsUri = process.env.REACT_APP_WEB_SOCKET_URL;
    var websocket;

    function init() {
        webSocket();
        setInterval(() => {
            doPing();
        }, 10000);
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
        const data = JSON.parse(evt?.data)?.data;
        if (JSON.stringify(data) !== '{}') {
            if (data?.kind == 1) {
                notification.success({ message: 'Done Task', description: data?.message });
            } else if (data?.kind == 2) {
                notification.info({ message: 'New Task', description: data?.message });
            } else {
                notification.error({ message: 'Cancel Task', description: data?.message });
            }
        }
        console.log(data);
        //websocket.close();
    }
    function onError(evt) {
        console.log(evt.data);
    }

    function doSend(message) {
        // console.log('SENT: ' + message);
        websocket.send(message);
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
