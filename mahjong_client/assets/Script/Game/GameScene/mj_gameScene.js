/*
    处理游戏里的逻辑
 */

cc.Class({
    extends: cc.Component,

    properties: {
        playerArr: [],  // 保存玩家的数组
    },

    // use this for initialization
    onLoad: function () {
        // 屏幕适配
        cc.dd.appUtil.setScreenFit(this.node);
    },

    // 玩家自己进入房间
    selfEnterRoom(data) {

    },

    // 别的玩家加入房间
    otherPlayerEnterRoom(data) {

    },

    // 添加玩家
    addPlayer(data) {

    },

    // 移除玩家
    removePlayer(data) {

    },
});
