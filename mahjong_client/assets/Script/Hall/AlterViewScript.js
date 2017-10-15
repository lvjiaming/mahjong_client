cc.Class({
    extends: cc.Component,

    properties: {
        MesLabel: {
            default: null,
            type: cc.Label,
            tooltip: "显示输入的节点",
        },
    },


    onLoad: function () {
        cc.dd.net.addObserver(this);
    },
    onDestroy() {
        cc.dd.net.removeObserver(this);
    },
    onMessageEvent(event, data) {
        if (event == cc.dd.gameCfg.EVENT.EVENT_ENTER_ROOM_REP){
            cc.log("更改alterview显示的提示信息");
            this.MesLabel.string = data.errmsg;
        }
    },
    onClickComfrimMessage() {
        cc.log(`确认：关闭`);
        this.node.destroy();
    },

});
