/**
 * Created by Administrator on 2017/8/31.
 */
const EventManager = require("../../Event/EventManager.js");

const UserEventName = {

};
cc.dd.userEvName = UserEventName;
const UserEvent = cc.Class({
    extends: EventManager,
});
cc.dd.userEvent = UserEvent.getInstance();
const User = cc.Class({
    statics: {
        getInstance() {
            if (!this.user) {
                this.user = new User();
            }
            return this.user;
        },
    },
    properties: {

    },
});
cc.dd.user = User.getInstance();