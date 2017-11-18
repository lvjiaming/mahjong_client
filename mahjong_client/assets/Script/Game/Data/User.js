/**
 * Created by Administrator on 2017/8/31.
 */
const EventManager = require("../../Event/EventManager.js");

const UserEventName = {
    USER_LOGIN_SCU: "user_login_suc", // 用户登录成功
    USER_LOGIN_FAIL: "user_login_fail",
    QUERY_RECEIVER_SCU: "query_receiver_scu", //查询接收者信息成功
    USER_INFO_KEY: "userInfoKey",  // 本地化读写 _userinfo 的key
    USER_CARD_INFO_KEY: "userCardInfoKey",  // 本地化读写用户用卡状态
    USER_ANGENT_INFO: "userAgentInfoKey",  // 本地化读写用户卡库存 的key
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
        _agentInfo: null, // 代理商库存信息
        _cardStateInfo: null, // 用户在用次卡还是包时卡的相关信息
        _countNum: null, // 给解散房间的同意进度条倒数
        _creatRoomDelegate: null, // 是否是代理人新建代理房间
        _did: null,
    },
    // 设置用户信息
    setUserInfo(user) {
        cc.log("user:" + JSON.stringify(user));
        this._userInfo = user;
    },
    // 得到用户信息
    getUserInfo() {
        if(!this._userInfo) {
            this._userInfo = JSON.parse(cc.sys.localStorage.getItem(cc.dd.userEvName.USER_INFO_KEY));
        }
        return this._userInfo;
    },
    // 设置接收者信息
    setReciverInfo(user) {
        cc.log("user.js:setReciverInfo的参数："+user);
        this._receiverInfo = user;
    },
    // 得到接收者信息
    getReciverInfo() {
        return this._receiverInfo;
    },
    // 设置代理商信息
    setAgentInfo(data) {
        this._agentInfo = data;
    },
    // 得到代理商信息
    getAgentInfo() {
        if(!this._agentInfo) {
            this._agentInfo = JSON.parse(cc.sys.localStorage.getItem(cc.dd.userEvName.USER_ANGENT_INFO));
        }
      return this._agentInfo;
    },
    // 设置当前用户用卡状态
    setCardState(data) {
        this._cardStateInfo = data;
    },
    // 得到当前用户用卡状态
    getCardState() {
        if(!this._cardStateInfo) {
            this._cardStateInfo = JSON.parse(cc.sys.localStorage.getItem(cc.dd.userEvName.USER_CARD_INFO_KEY));
        }
        return this._cardStateInfo;
    },
    // 用户登录成功，更新用户信息
    updataUserInfo(data) {
        this.setUserInfo(data);
        cc.dd.userEvent.notifyEvent(cc.dd.userEvName.USER_LOGIN_SCU, data);
    },
    // 用户登录成功，更新代理商信息
    updateAgentInfo(data) {
        this.setAgentInfo(data);
    },
    // 用户登录成功，更新用户用卡信息
    updateCardStateInfo(data) {
        this.setCardState(data);
    },
    // 查询接收者用户房卡数量成功，更新接收者信息
    updataUserFangka(data) {
        this.updataReciverInfo(data);
        if (this._userInfo.UID == data.uid4query) {
            cc.log("当前登录用户房卡数量"+ data.mycards);
            this._userInfo.roomcardnum = data.mycards;
            cc.dd.userEvent.notifyEvent(cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REQ, data);
        }else {
            cc.log("接收者昵称"+ data.nickname);
            cc.dd.userEvent.notifyEvent(cc.dd.userEvent.QUERY_RECEIVER_SCU, data);
        }
    },
    updataReciverInfo(data) {
        this.setReciverInfo(data);
        cc.dd.userEvent.notifyEvent(cc.dd.userEvName.QUERY_RECEIVER_SCU, data);
    },
    // 设置did（设备唯一识别）
    setUserDid(did) {
        this._did = did;
    },
    // 得到did
    getUserDid() {
        return this._did;
    },
});
cc.dd.user = User.getInstance();