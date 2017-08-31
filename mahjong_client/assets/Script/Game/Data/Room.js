/**
 * Created by Administrator on 2017/8/31.
 */
const EventManager = require("../../Event/EventManager.js");
const RoomEvName = {

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