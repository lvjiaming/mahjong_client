cc.Class({
    extends: cc.Component,

    properties: {
        BarAni: {
            default: null,
            type: cc.Animation,
            tooltip: "音量调动画",
        },
    },

    // use this for initialization
    onLoad: function () {
        this.BarAni.play();
    },
    onDestroy() {
        this.BarAni.stop();
        // this.node.removeFromParent();
    },

});
