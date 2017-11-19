/**
 * Created by Administrator on 2017/8/31.
 */
const EventManager = require("../../Event/EventManager.js");
const RoomEvName = {
    USER_ENTER_ROOM: "user_enter_room", // 玩家进入房间
    ROOM_GAME_DATA: "room_game_data", // 房间数据
    MSG_NOTIFY: "msg_notify",
};
cc.dd.roomEvName = RoomEvName;
const RoomEvent = cc.Class({
    extends: EventManager,
});
cc.dd.roomEvent = RoomEvent.getInstance();
const Room = cc.Class({
    statics: {
        getInstance() {
            if (!this.room) {
                this.room = new Room();
            }
            return this.room;
        },
    },
    properties: {
        userList: [], // 玩家列表
        _countNum: null, // 倒计时
        _winneruid:null,  // 结算界面，赢家id
        _dianpaouid: null, // 结算界面，点炮id
        _guipai: null,  // 结算界面，鬼牌
        _subcommand: null, // 结算界面，为4时显示返回大厅
        _roomRules: null, // 游戏房间玩法规则
        _currentMessageSeatID: null,  // 当前播放的语音信息的是这个座位号的
        _currentMessageID: null,  // 当前播放的语音消息的id
        _hasMessageOnPlay: null,  // 当前有正在播放的语音消息
        _selfRecording: null,  // 录音发言中
        huing: null,    // 收到胡牌广播
        _playerNodeArr: [], // 四玩家的节点数组
        _isFourZeroOneTwo: null, // 4012状态下点过不需要发送2002
    },
    // 房间数据
    updataRoomData(data) {
        this.userList = data.userlist;
        if (cc.director.getScene().sceneId !== cc.dd.sceneID.GAME_SCENE) {
            cc.log(`未在游戏场景，此协议缓存`);
            cc.dd.roomEvent.addMsg(cc.dd.roomEvName.ROOM_GAME_DATA, data);
        } else {
            cc.dd.roomEvent.addMsgToCacheList(cc.dd.roomEvName.ROOM_GAME_DATA, data);
            cc.log("在游戏场景中，协议准备执行");
            if (cc.director.getScene().sceneId == cc.dd.sceneID.GAME_SCENE) {
                cc.dd.roomEvent.notifyEvent(cc.dd.roomEvName.MSG_NOTIFY);
            }
            // cc.dd.roomEvent.notifyEvent(cc.dd.roomEvName.ROOM_GAME_DATA, data);
        }
    },
    // 所有游戏中的协议，如果未在游戏场景，讲协议缓存
    saveMsg(event, data) {
        // if (cc.director.getScene().sceneId !== cc.dd.sceneID.GAME_SCENE) {
        //     cc.log(`未在游戏场景，此协议缓存`);
        //     cc.dd.roomEvent.addMsg(event, data);
        // } else {
        //     cc.dd.net.notifyEvent(event, data);
        // }
        // if(this.huing) {
        //     cc.log("huing为true");
        //     return;
        // }
        cc.dd.roomEvent.addMsgToCacheList(event, data);
        if (cc.director.getScene().sceneId == cc.dd.sceneID.GAME_SCENE) {
            if(cc.dd.roomEvent._cacheList.length === 2 && cc.dd.roomEvent._cacheList[1].event == 4012){
                cc.dd.roomEvent.notifyCacheList();
            }else {
                cc.dd.roomEvent.notifyEvent(cc.dd.roomEvName.MSG_NOTIFY);
            }
        }
    },
});
cc.dd.room = Room.getInstance();