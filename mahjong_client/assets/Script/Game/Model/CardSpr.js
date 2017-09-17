cc.Class({
    extends: cc.Component,

    properties: {
        Spr: {
            default: null,
            type: cc.Sprite,
            tooltip: "纹理",
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     *  初始化出的牌
     * @param data
     */
    initCard(data) {
        let str = "";
        switch (data.suit) {
            case cc.dd.gameCfg.CARD_SUIT.WAN: {
                str = str + "wanzi_" + data.num;
                break;
            }
            case cc.dd.gameCfg.CARD_SUIT.TIAO: {
                str = str + "tiaozi_" + data.num;
                break;
            }
            case cc.dd.gameCfg.CARD_SUIT.TONG: {
                str = str + "tongzi_" + data.num;
                break;
            }
            case cc.dd.gameCfg.CARD_SUIT.HUA: {
                str += "mj_hua_";
                break;
            }
            case cc.dd.gameCfg.CARD_SUIT.OTHER: {
                str = str + "zipai_" + data.num;
                break;
            }
            default: {
                cc.log(`花色未知:${data.suit}`);
                break;
            }
        }
        this.Spr.spriteFrame = cc.dd.dirRes[str.toUpperCase()];
    },
});
