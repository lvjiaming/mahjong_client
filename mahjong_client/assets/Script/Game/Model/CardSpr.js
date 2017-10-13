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
        this.suit = parseInt(data / 9) + 1;
        this.num = data % 9 + 1;
        switch (this.suit ) {
            case cc.dd.gameCfg.CARD_SUIT.WAN: {
                str = str + "wanzi_" + this.num;
                break;
            }
            case cc.dd.gameCfg.CARD_SUIT.TIAO: {
                str = str + "tiaozi_" + this.num;
                break;
            }
            case cc.dd.gameCfg.CARD_SUIT.TONG: {
                str = str + "tongzi_" + this.num;
                break;
            }
            case cc.dd.gameCfg.CARD_SUIT.OHTER: {
                str = str + "zipai_" + this.num;
                break;
            }
            default: {
                cc.log(`花色未知:${this.suit}`);
                break;
            }
        }
        this.Spr.spriteFrame = cc.dd.dirRes[str.toUpperCase()];
    },
});
