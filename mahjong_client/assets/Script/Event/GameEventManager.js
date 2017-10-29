
const EventManager = require('./EventManager.js');
const GameEventManager = cc.Class({
    extends: EventManager,
    gameSocket: null,
    hostStr: null, // 连接的地址
    reconnectMaxNum: null,  // 重连的最大次
    reconnectCount: null, // 重连的计数
    reconnectTime: null, // 重连的间断时间
    reconnectTimer: null, // 重连的调度器

    isDisConnect: null,  // 是否是主动断开连接
    _heartCheckTime: null, // 心跳检测的时间
    _heartCurTime: null, // 当前的时间
    _heartIsOk: null, // 心跳检测是否正常
    _heartTimer: null, // 心跳检测的调度器

    _ownSet: null,// 回调监听的对象
    _isReconnect: null, // 是否是重连的
    /**
     *  构造函数
     */
    ctor() {
        this.gameSocket = null;
        this.reconnectMaxNum = 100;
        this.reconnectCount = 0;
        this.reconnectTime = 1000;
        this.reconnectTimer = null;
        this.isDisConnect = false;
        this.hostStr = null;
        this._heartCheckTime = 1000;
        this._heartCurTime = 0;
        this._heartIsOk = true;
        this._heartTimer = null;
        this._isReconnect = false;
    },
    /**
     *  设置回调监听的对象
     */
    setCallBack(target) {
        this._ownSet = target;
    },
    /**
     *  连接服务器，已经监听服务器一系列事件
     */
    connect(hostStr, callBack) {
        cc.log(`进行网络连接, hostStr = ${hostStr}`);
        this.hostStr = hostStr;
        const self = this;
        this.gameSocket = new WebSocket(hostStr);
        this.gameSocket.onopen = () => {
            cc.log(`websocket has connect`);
            this.cleanReconnectTimer();
            this._heartIsOk = true;
            cc.dd.tipMgr.hide();
            this.heartCheck();
            if (this._isReconnect) {
                if (this._ownSet) {
                    this._ownSet.reconnected();
                }
                this._isReconnect = false;
            }
            if (callBack && callBack instanceof Function) {
                callBack();
            }
        };
        this.gameSocket.onerror = () => {
            cc.log(`websocket connect error`);
        };
        this.gameSocket.onclose = () => {
            cc.log(`websocket has close`);
            if (!this.isDisConnect) {
                this.reconnect();
            }
        };
        this.gameSocket.onmessage = (data) => {
            if (data.data == "pong") {
                cc.log(`heart: ${data.data}`);
                this._heartIsOk = true;
            } else {
                data = JSON.parse(data.data);
                const msgId = data.command;
                const msgData = data;
                self.onMsg(msgId, msgData);
            }
            return;
            //  todo 以下是用protobuf传输数据写法
            if (cc.sys.isNative) {
                self.handleData(data.data);
            } else {
                const fileReader = new FileReader();  //  在浏览器中读取文件
                fileReader.onload = function (progressEvent) {  //  读取文件完成后触发（成功读取）
                    const utfs = this.result;  //  result就是读取的结果
                    self.handleData(utfs);
                };
                fileReader.readAsArrayBuffer(data.data);
            }
        };
        this.gameSocket.sendMessage = (msgData, state) => {
            if (this.gameSocket.readyState === WebSocket.OPEN) {
                cc.log(`发送的消息为：${JSON.stringify(msgData)}`);
                if (state) {
                    this.gameSocket.send(msgData)
                } else {
                    this.gameSocket.send(JSON.stringify(msgData));
                }
            } else {
                cc.error(`websocket connect error: ${this.gameSocket.readyState}`);
            }
        };
    },
    /**
     * 心跳检测
     */
    heartCheck() {
        const timeFun = () => {
            if (this._heartIsOk) {
                if (this.gameSocket) {
                    const str = "ping";
                    if (this.gameSocket.readyState === WebSocket.OPEN) {
                        this._heartIsOk = false;
                        // this.gameSocket.send(str);
                        this.sendMessage(str, true)
                    }
                }
                this._heartCurTime = 0;
            } else {
                this._heartCurTime ++;
            }
            if (this._heartCurTime >= 5) {
                cc.log(`心跳检测有问题`);
                clearTimeout(this._heartTimer);
                // this.close(false);
            } else {
                this.heartCheck();
            }
        };
        this._heartTimer = setTimeout(timeFun, this._heartCheckTime);
    },

    /**
     *  重连
     */
    reconnect() {
        if (this.reconnectCount > this.reconnectMaxNum) {
            cc.log("重连次数已达最大");
            return;
        }
        this.reconnectTimer = setTimeout(() => {
            cc.log(`正在进行第${this.reconnectCount}次重连`);
            cc.dd.tipMgr.show("网络连接中断，正在重新连接....");
            this.connect(this.hostStr);
            this._isReconnect = true;
            this.reconnectCount ++;
        }, this.reconnectTime);
    },

    /**
     *  连接成功，清空重连的调度器
     */
    cleanReconnectTimer() {
        this.reconnectCount = 0;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    },

    /**
     *  发送消息给服务端
     * @param msgId 消息的id
     * @param msgData 消息的数据
     */
    sendMessage(msgData, state) {
        if (msgData === null || msgData === undefined) {
            msgData = null;
            cc.log(`消息为空`);
            return;
        }
        this.gameSocket.sendMessage(msgData, state);
    },
    /**
     *  关闭与服务器的连接(主动断开)
     */
    close(isDis) {
        this.gameSocket.close();
        this.gameSocket = null;
        this.isDisConnect = isDis;
    },
    /**
     *  处理数据（反序列化以及转化）
     * @param data 数据
     */
    handleData(data) {
        const bytes = new Uint8Array(data);  // 转化数据
        let msgId = bytes[0];  //  协议id放在uint8Array的第一位
        const body = new Uint8Array(data, 1, data.byteLength - 1);
        this.onMsg(msgId, body);
    },
});
