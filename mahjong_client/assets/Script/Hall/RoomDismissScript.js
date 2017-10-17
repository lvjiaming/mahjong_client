cc.Class({
    extends: cc.Component,

    properties: {
       agreeOnDismiss :{
            default: null,
            type: cc.Label,
            tooltip: "确认取消房间",
       },
    },

    // use this for initialization
    onLoad: function () {
        cc.dd.net.addObserver(this);
        // 倒计时一分钟，一分钟后自动拒绝
        cc.dd.room._countNum = 60;
        this.callback = function () {
            if (cc.dd.room._countNum === 0) {
                this.onConfrimClick();
                this.unschedule(this.callback);
            }
            cc.dd.room._countNum--;
            this.agreeOnDismiss.string = cc.dd.room._countNum;
        }
        this.agreeOnDismiss.schedule(this.callback, 1);
    },
    onDestroy() {
        this.unschedule(this.callback);
        cc.dd.net.removeObserver(this);
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
    // cc.dd.userEvent.addObserver(this);
    // cc.dd.userEvent.removeObserver(this);
    onMessageEvent(event, data) {
        switch (event) {
            case cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_ANOUNCE: { // 不能写在这里
                cc.log("收到4003");
                // 弹窗出
                cc.dd.Reload.loadPrefab("Hall/Prefab/RoomDismiss", (prefab) => {
                    const RoomDismiss = cc.instantiate(prefab);
                    cc.find("UI_ROOT").addChild(RoomDismiss);
                });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_STATE: {
                cc.log("收到4004");
                // 更新条条
                break;
            }
            case  cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_RESULT: {
                cc.log("收到4008");
                // 返回大厅
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },
});
