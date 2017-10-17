/**
 * Created by Administrator on 2017/8/31.
 */
const EventManager = require("../../Event/EventManager.js");

const UserEventName = {
    USER_LOGIN_SCU: "user_login_suc", // 用户登录成功
    QUERY_RECEIVER_SCU: "query_receiver_scu", //查询接收者信息成功
    EXCHANGE_FK_SCU: "exchange_fk_scu", // 转让房卡成功
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
        _receiverInfo: null, // 房卡转让接受者信息
        _isagent: null,  // 是否是代理商
    },
    // 设置用户信息
    setUserInfo(user) {
        cc.log("user.js:setUserInfo的参数："+ user);
        this._userInfo = user;
        if(user.isagent) {
            cc.log(user.isagent);
            this._isagent = user.isagent;
        }
    },
    // 得到用户信息
    getUserInfo() {
        return this._userInfo;
    },
    // 设置接收者信息
    setReciverInfo(user) {
        cc.log("user.js:setReciverInfo的参数："+user);
        this._receiverInfo = user;
    },
    // 得到接收者信息
    getReciverInfo() {
        // cc.log(this._receiverInfo);
        return this._receiverInfo;
    },
    // 用户登录成功
    updataUserInfo(data) {
        this.setUserInfo(data);
        cc.dd.userEvent.notifyEvent(cc.dd.userEvName.USER_LOGIN_SCU, data);
    },
    // 查询接收者用户房卡数量成功
    updataReciverInfo(data) {
        this.setReciverInfo(data);
        cc.dd.userEvent.notifyEvent(cc.dd.userEvName.QUERY_RECEIVER_SCU, data);
    },
    // 查询当前用户房卡数量成功
    updataUserFangka(data) {
        if (this._userInfo.UID == data.uid4query) {
            cc.log("当前登录用户房卡数量"+ data.mycards);
            this._userInfo.roomcardnum = data.mycards;
            cc.dd.userEvent.notifyEvent(cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REQ, data);
        }else {
            cc.log("接收者昵称"+ data.nickname);
            this.updataReciverInfo(data);
            cc.dd.userEvent.notifyEvent(cc.dd.userEvent.QUERY_RECEIVER_SCU, data);
        }
    },
});
cc.dd.user = User.getInstance();