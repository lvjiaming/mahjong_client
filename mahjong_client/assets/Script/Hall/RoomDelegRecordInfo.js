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
            type: cc.Button,
            tooltip: "复制此房间号",
        },
        InviateWXFriends: {
            default: null,
            type: cc.Button,
            tooltip: "邀请微信好友",
        },
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
    },
    onCopyRoomIdClick() {
        cc.log("复制房间号");
    },
    onInvitatedFriendsClick() {
        cc.log("邀请微信朋友");
    },
});
