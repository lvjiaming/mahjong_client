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
        _userInfo: null, // 用户信息
    },
    // 设置用户信息
    setUserInfo(user) {
        cc.log("user.js:setUserInfo的参数："+user);
        this._userInfo = user;
    },
    // 得到用户信息
    getUserInfo() {
        cc.log(this._userInfo);
        return this._userInfo;
    },
    // 用户登录成功
    updataUserInfo(data) {
        this.setUserInfo(data.user);
        cc.log("刚登录返回的"+ data);
        cc.log("data.user:" + data.user);
        cc.dd.userEvent.notifyEvent(cc.dd.userEvName.USER_LOGIN_SCU, data);
    },
});
cc.dd.user = User.getInstance();