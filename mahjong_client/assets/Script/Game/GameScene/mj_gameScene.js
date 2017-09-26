/*
    处理游戏里的逻辑
 */

const cardArr = [
    {id: 1},
    {id: 10},
    {id: 13},
    {id: 14},
    {id: 10},
    {id: 11},
    {id: 20},
    {id: 25},
    {id: 27},
    {id: 33},
    {id: 21},
    {id: 11},
    {id: 12},
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
        cc.dd.soundMgr.playMusic("resources/Game/Sound/common/bg.mp3", true);

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
