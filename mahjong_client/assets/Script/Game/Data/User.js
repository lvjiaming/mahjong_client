/**
 * Created by Administrator on 2017/8/31.
 */
const EventManager = require("../../Event/EventManager.js");

const UserEventName = {
    USER_LOGIN_SCU: "user_login_suc", // 用户登录成功
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
        _userid: null, // 用户Id
    },
    // 设置用户id
    setUserId(userid) {
        this._userid = userid;
    },
    // 得到用户id
    getUserId() {
        return this._userid;
    },
    // 用户登录成功
    setUserInfo(data) {
        this.setUserId(data.user.UID);
        cc.dd.userEvent.notifyEvent(cc.dd.userEvName.USER_LOGIN_SCU, data.user);
    },
});
cc.dd.user = User.getInstance();