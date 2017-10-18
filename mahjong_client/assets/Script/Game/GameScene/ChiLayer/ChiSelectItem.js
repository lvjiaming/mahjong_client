cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },
    // 选择按钮
    onSelectClick(event) {
        cc.log(`吃的牌:${this.node.data[1]}`);
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHICARD_REP, this.node.data);
        this.node.parent.parent.destroy();
    },
});
