/*
    处理游戏里的逻辑
 */

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        // 屏幕适配
        cc.dd.appUtil.setScreenFit(this.node);
    },
});
