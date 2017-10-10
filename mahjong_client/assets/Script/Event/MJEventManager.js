/**
 * Created by Administrator on 2017/8/31.
 */
const GameEventManager = require("./GameEventManager.js");
const MJEventManager = cc.Class({
    extends: GameEventManager,
    statics: {
        getInstance() {
            if (!this.mjEvntManager) {
                this.mjEvntManager = new MJEventManager();
            }
            return this.mjEvntManager;
        },
    },

    connectNet(host, cb) {
        this.connect(host, cb);
    },

    /**
     *  请求协议
     * @param event 协议id
     * @param data 需要的字段
     */
    startEvent(event, data) {
        cc.log(`发送的协议id为：${event}`);
        switch (event) {
            case cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REP: {
                this.sendMessage(data);
                break;
            }
            // 需要添加协议，你在下面添加，我在上面添加
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },

    /**
     *  收到服务器回复
     * @param msgId 回复的协议id
     * @param msgData 回复的字段
     */
    onMsg(msgId, msgData) {
        cc.log(`收到的协议id为：${msgId}`);
        switch (msgId) {
            case cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REQ: {
                cc.dd.user.setUserInfo(msgData);
                break;
            }
            // 回复处理，你在下面添加，我在上面添加
            default: {
                cc.log(`unkown msgId: ${msgId}`);
            }
        }
    }
});
cc.dd.net = MJEventManager.getInstance();