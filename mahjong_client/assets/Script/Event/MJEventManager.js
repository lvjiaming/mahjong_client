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
        const body = {
            "command": event,
            "did": "10325223-c191-4b61-a9ea-60144187dcaa", // 真机里换调起oc方法
        };
        switch (event) {
            case cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REP: {  // 检查登录，1001
                body.code = data; // 真机里不需要它
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CREATE_ROOM_REP: {  // 新建房间，1003
                body.roomsetting = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_ROOM_REP: {  // 玩家进入房间的请求,1004
                body.roomid = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_OUTCARD_REP: {  // 玩家出牌的请求
                body.chupai = data.id;
                body.tingpai = data.tingpai;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHICARD_REP: {  // 玩家吃牌的请求
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_PENGCARD_REP: {  // 玩家碰牌的请求
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_GANGCARD_REP: {  // 玩家杠牌的请求
                body.gangpai = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_HUCARD_REP: {  // 玩家胡牌的请求
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_GUOCARD_REP: {  // 玩家过牌的请求
                this.sendMessage(body);
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
            case cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REQ: {  // 检查登录的回复,5001
                cc.dd.user.updataUserInfo(msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ROOM_DATA: {  // 房间数据,4001
                cc.log(msgData);
                cc.dd.room.updataRoomData(msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_GAME_STATE: {  // 房间状态
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_OUTCARD_RAD: {  // 玩家出牌的广播
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHICARD_RAD: {  // 玩家吃牌的广播
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_PENGCARD_RAD: {  // 玩家碰牌的广播
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_GANGCARD_RAD: {  // 玩家杠牌的广播
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_HUCARD_RAD: {  // 玩家胡牌的广播
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_MOCARD_RAB: {  // 玩家摸牌的广播
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_TIMER_SPRCIEL: {  // 指针转动
                cc.dd.room.saveMsg(msgId, msgData);
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