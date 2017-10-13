cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },
    onEnable() {
        const fadeIn = cc.fadeIn(0.5);
        const fadeOut = cc.fadeOut(0.5);
        this.node.runAction(cc.repeatForever(cc.sequence(fadeOut, fadeIn)));
    },
    onDisable() {
        this.node.stopAllActions();
    },

});
