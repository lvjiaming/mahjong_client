cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },
    // 选择按钮
    onSelectClick(event) {
        cc.log(`杠的牌:${this.node.data}`);
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_GANGCARD_REP, this.node.data);
        this.node.parent.parent.destroy();
    },
});
