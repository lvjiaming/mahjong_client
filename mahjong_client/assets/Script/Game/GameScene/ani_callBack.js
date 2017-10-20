cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },
    onEnable() {
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.6);
    },
});
