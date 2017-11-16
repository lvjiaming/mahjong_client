cc.Class({
    extends: cc.Component,

    properties: {
        fangkaAmountLabel: {
            default: null,
            type: cc.Label,
            tooltip: "您确认转让张房卡给玩家",
        },
        recieverNameLabel: {
            default: null,
            type: cc.Label,
            tooltip: "玩家名",
        },
        recieverAvatar: {
            default: null,
            type: cc.Sprite,
            tooltip: "玩家头像",
        },
    },

    // use this for initialization
    onLoad: function () {
    },

    setUserInfo(data) {
        this.setFangkaAmountLabelContent(cc.dd.user._receiverInfo.recieveCardNum);
        this.setRecieverNameLabelContent(data.nickname,data.uid4query);
        this.setRecieverAvatarContent(data.wx_portrait);

    },
    setFangkaAmountLabelContent(data) {
        this.fangkaAmountLabel.string = "您确认转让" + data + "张房卡给玩家";
    },
    setRecieverNameLabelContent(data,recUid) {
        this.recieverNameLabel.string = data + "（ID：" + recUid + ")";
    },
    setRecieverAvatarContent(data) {
        var target = this.recieverAvatar;
        cc.dd.setPlayerHead(data,target);
    },
    onCancleClick() {
        this.node.destroy();
    },
    onComfrimClick() {
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CARDCHANGE_REP,cc.dd.user.getReciverInfo());
        this.node.destroy();
    },
});
