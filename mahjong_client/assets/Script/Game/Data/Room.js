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
    },
    // 房间数据
    updataRoomData(data) {
        this.userList = data.userlist;
        if (cc.director.getScene().sceneId !== cc.dd.sceneID.GAME_SCENE) {
            cc.log(`未在游戏场景，此协议缓存`);
            cc.dd.roomEvent.addMsg(cc.dd.roomEvName.ROOM_GAME_DATA, data);
        } else {
            cc.dd.roomEvent.addMsgToCacheList(cc.dd.roomEvName.ROOM_GAME_DATA, data);
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
        cc.dd.roomEvent.addMsgToCacheList(event, data);
        if (cc.director.getScene().sceneId == cc.dd.sceneID.GAME_SCENE) {
            cc.dd.roomEvent.notifyEvent(cc.dd.roomEvName.MSG_NOTIFY);
        }
    },
});
cc.dd.room = Room.getInstance();