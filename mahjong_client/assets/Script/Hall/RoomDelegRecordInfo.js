
const PLAY_OPERA_NAME = [
    null,
    "可断门",
    "闭门胡",
    "会牌",
    "搂宝",
    "夹胡",
    "点炮包三家"
];
cc.Class({
    extends: cc.Component,

    properties: {
        RoomID: {
            default: null,
            type: cc.Label,
            tooltip: "房间号",
        },
        GameRules: {
            default: null,
            type: cc.Label,
            tooltip: "房间规则",
        },
        RoomState: {
            default: null,
            type: cc.Label,
            tooltip: "房间状态",
        },
        RoomBalanceState: {
            default: null,
            type: cc.Label,
            tooltip: "房间结算状态",
        },
        CopyRoomID: {
            default: null,
            type: cc.Node,
            tooltip: "复制此房间号",
        },
        InviateWXFriends: {
            default: null,
            type: cc.Node,
            tooltip: "邀请微信好友",
        },
        didGameStarted: null,
        wanfaString: null,
        roomidString: null,
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     *  初始化单个信息
     * @param data
     */
    initInfo(data) {
        cc.log(`初始化单个信息`);
        this.roomidString = data.roomid.toString();
        this.RoomID.string = data.roomid;
        this.setDelegRoomGameRulesString(data.playrule);
        this.setDelegRoomStateString(data);
    },
    setDelegRoomGameRulesString(data){
        if (data) {
            let str;
            data.forEach((item) => {
                if(!str){
                    str = PLAY_OPERA_NAME[item];
                }else {
                    str = str + " " + PLAY_OPERA_NAME[item];
                }
            });
            this.GameRules.string = str;
            this.wanfaString = str;
        }
    },
    setDelegRoomStateString(data){
        if(data.nowround == -1){
            // 游戏未开始
            this.didGameStarted = false;
            this.RoomState.string = "未开始" + "\n" +"已就位" + data.players + "人";
        }else {
            // 游戏开始了x局
            this.didGameStarted = true;
            this.RoomState.string = "进行中" + "\n" +"第" + data.nowround + "局";
        }
        this.setDelegBalanceState(data.roomcardused);
    },
    setDelegBalanceState(data) {
        if(this.didGameStarted) {
            this.CopyRoomID.active = false;
            this.InviateWXFriends.active = false;
            if(data) {
                this.RoomBalanceState.string = "房卡已结算";
            }else {
                this.RoomBalanceState.string = "房卡未结算";
            }
        }else {
            this.CopyRoomID.active = true;
            this.InviateWXFriends.active = true;
            this.RoomBalanceState.string = "";
        }
    },
    onCopyRoomIdClick() {
        cc.log("复制房间号");
    },
    onInvitatedFriendsClick() {
        cc.log("邀请微信朋友");
        var contentstr = "立刻进入正宗朝阳北票建平凌源手机麻将。本房间玩法：" + this.wanfaString + "。房间号：" + this.roomidString;
        if(cc.sys.isMobile) {
            jsb.reflection.callStaticMethod("WXShareTool", "jsInitiateWXFriendsShare:",contentstr);//this.roomidString
        }
    },
});
