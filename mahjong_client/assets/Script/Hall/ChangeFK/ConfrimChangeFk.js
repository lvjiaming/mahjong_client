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
        this.setUserInfo();
        cc.dd.net.addObserver(this);
        cc.dd.userEvent.addObserver(this);
    },
    onDestroy() {
        cc.dd.net.removeObserver(this);
        cc.dd.userEvent.removeObserver(this);
    },
    setUserInfo() {
        this.setFangkaAmountLabelContent(cc.dd.user._userInfo.recieveCardNum);
        this.setRecieverNameLabelContent(cc.dd.user.getReciverInfo().nickname,cc.dd.user.getReciverInfo().uid4query);
        // this.setRecieverAvatarContent(cc.dd.user.getReciverInfo().wx_portrait);

    },
    setFangkaAmountLabelContent(data) {
        this.fangkaAmountLabel.string = "您确认转让" + data + "张房卡给玩家";
    },
    setRecieverNameLabelContent(data,recUid) {
        this.recieverNameLabel.string = data + "（ID：" + recUid + ")";
    },
    setRecieverAvatarContent(data) {
        //头像
    },
    onCancleClick() {
        this.node.destroy();
    },
    onComfrimClick() {
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CARDCHANGE_REP,cc.dd.user.getReciverInfo().uid4query);
    },
    onMessageEvent(event, data) {
        // switch(event) {
        //     case cc.dd.userEvent.EXCHANGE_FK_SCU: {
        //         this.node.destroy();
        //         break;
        //     }
        //     default: {
                cc.log(`unkown event: ${event}`);
            // }
        // }
    },
});
