/**
 * Created by Administrator on 2017/8/31.
 */
const EventManager = require("../../Event/EventManager.js");
const RoomEvName = {
    USER_ENTER_ROOM: "user_enter_room", // 玩家进入房间
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
    },
});
cc.dd.room = Room.getInstance();