cc.Class({
    extends: cc.Component,

    properties: {
       agreeOnDismiss :{
            default: null,
            type: cc.Label,
            tooltip: "确认取消房间",
       },
        applyerName: {
            default: null,
            type: cc.Label,
            tooltip: "申请人昵称",
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.dd.net.addObserver(this);
        // 倒计时一分钟，一分钟后自动拒绝
        cc.dd.room._countNum = 30;
        this.callback = function () {
            if (cc.dd.room._countNum === 1) {
                this.unschedule(this.callback);
                this.onConfrimClick();
            }
            cc.dd.room._countNum--;
            this.agreeOnDismiss.string = cc.dd.room._countNum;
        }
        this.schedule(this.callback, 1);
    },
    onDestroy() {
        this.unschedule(this.callback);
        cc.dd.net.removeObserver(this);
    },
    initApplyernickname(data) {
        this.applyerName.string = data;
    },
    onRejectClick() {
        cc.log("拒绝取消房间");
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_DISAGREE);
        this.node.destroy();
    },
    onConfrimClick() {
        cc.log("确认取消房间");
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_AGREE);
        this.node.destroy();
    },
});
