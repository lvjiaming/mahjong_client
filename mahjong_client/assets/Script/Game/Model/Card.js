cc.Class({
    extends: cc.Component,

    properties: {
        PokerSpr: {
            default: null,
            type: cc.Sprite,
            tooltip: "麻将牌的纹理"
        },
        suit: 0,  //  牌的花色
        num: 0,  // 牌的值
    },
    onLoad: function () {
        this.initCard();
    },
    /**
     *  初始化牌（纹理）
     */
    initCard() {
        if (this.suit  === 0 || this.num === 0 ) {
            cc.log("牌值或花色未获取到值");
            return;
        }
    },
});
