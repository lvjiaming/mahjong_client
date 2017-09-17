/*
    处理游戏里的逻辑
 */

const cardArr = [
    {suit: 1, num: 3},
    {suit: 1, num: 4},
    {suit: 2, num: 5},
    {suit: 3, num: 6},
    {suit: 2, num: 7},
    {suit: 1, num: 8},
    {suit: 1, num: 9},
    {suit: 2, num: 8},
    {suit: 3, num: 3},
    {suit: 3, num: 4},
    {suit: 2, num: 5},
    {suit: 3, num: 7},
   // {suit: 2, num: 6},
];

cc.Class({
    extends: cc.Component,

    properties: {
        playerArr: [],  // 保存玩家的数组
        PlayerNode: {
            default: null,
            type: cc.Node,
            tooltip: "玩家的根节点",
        },
    },

    // use this for initialization
    onLoad: function () {
        // 屏幕适配
        cc.dd.appUtil.setScreenFit(this.node);

        // 测试手牌
        this.PlayerNode.getChildByName("Bottom").getComponent("PlayerSelf").createHandCard(cardArr);
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
