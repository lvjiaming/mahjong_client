// 麻将的状态
const CARD_STATE = {
    NORMAL: 1, // 正常状态
    SELECT: 2, // 选中状态
    HAS_OUT: 3, // 已经打出去了
};
const MOVE_Y = 20;
cc.Class({
    extends: cc.Component,

    properties: {
        PokerSpr: {
            default: null,
            type: cc.Sprite,
            tooltip: "麻将牌的纹理"
        },
        CardZheZhao: {
            default: null,
            type: cc.Node,
            tooltip: "遮罩",
        },
        suit: 2,  //  牌的花色
        num: 4,  // 牌的值
        cardState: CARD_STATE.NORMAL, // 牌的状态
        canOut: false,  // 是否能出
    },
    onLoad: function () {
        this.node.on("touchstart", this._touchStart.bind(this));
        this.node.on("touchend", this._touchEnd.bind(this));
        this.node.on("touchcancel", this._touchCancel.bind(this));
        this._pos_x = this.node.getPositionX();
        this._pos_y = this.node.getPositionY();
        this._initCard();
    },
    /**
     *  初始化牌（纹理）
     */
    _initCard() {
        if (this.suit  === 0 || this.num === 0 ) {
            cc.log("牌值或花色未获取到值");
            return;
        }
        let str = "";
        switch (this.suit) {
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
            case cc.dd.gameCfg.CARD_SUIT.HUA: {
                str += "mj_hua_";
                break;
            }
            case cc.dd.gameCfg.CARD_SUIT.OTHER: {
                str = str + "zipai_" + this.num;
                break;
            }
            default: {
                cc.log(`花色未知:${this.suit}`);
                break;
            }
        }
        this.PokerSpr.spriteFrame = cc.dd.dirRes[str.toUpperCase()];
    },
    /**
     *  麻将触摸开始事件
     * @private
     */
    _touchStart() {
        cc.log(`开始触摸`);
        if (this.CardZheZhao) {
            this.CardZheZhao.active = true;
        }
    },
    /**
     *  麻将触摸结束
     * @private
     */
    _touchEnd() {
        cc.log(`结束触摸`);
        if (this.CardZheZhao) {
            this.CardZheZhao.active = false;
        }
        switch (this.cardState) {
            case CARD_STATE.NORMAL: {
                this.selectCard();
                break;
            }
            case CARD_STATE.SELECT: {
                if (this.canOut) {
                    cc.log(`可以出牌`)
                } else {
                    this.cancelSelect();
                }
                break;
            }
            case CARD_STATE.HAS_OUT: {
                cc.log(`麻将已经打出去了`)
                break;
            }
        }
    },
    /**
     *  触摸取消
     * @private
     */
    _touchCancel() {
        cc.log(`触摸取消`);
        if (this.CardZheZhao) {
            this.CardZheZhao.active = false;
        }
    },
    /**
     *  麻将被选择
     */
    selectCard() {
        this.node.runAction(cc.moveTo(0.1, cc.p(this._pos_x, this._pos_y + MOVE_Y)));
        this.cardState = CARD_STATE.SELECT;
    },
    /**
     *  麻将取消选择
     */
    cancelSelect() {
        this.node.runAction(cc.moveTo(0.1, cc.p(this._pos_x, this._pos_y)));
        this.cardState = CARD_STATE.NORMAL;
    },
});
