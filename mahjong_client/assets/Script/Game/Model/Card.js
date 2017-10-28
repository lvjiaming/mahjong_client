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
        isHuiPi: false,
        id: -1,  // 牌的id
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
        if (this.id === -1) {
            cc.log("牌值或花色未获取到值");
            return;
        }
        this.suit = parseInt(this.id / 9) + 1;
        this.num = this.id % 9 + 1;
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
            case cc.dd.gameCfg.CARD_SUIT.OHTER: {
                str = str + "zipai_" + this.num;
                break;
            }
            default: {
                cc.log(`花色未知:${this.suit}`);
                break;
            }
        }
        this.PokerSpr.spriteFrame = cc.dd.dirRes[str.toUpperCase()];
        if (this.isHuiPi) {
            this.node.getChildByName("IsHuiPai").active = true;
        }
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
                const readyCard = cc.dd.cardMgr.getReadyOutCard();
                if (readyCard) {
                    readyCard.getComponent("Card").cancelSelect();
                }
                cc.dd.cardMgr.setReadyOutCard(this.node);
                break;
            }
            case CARD_STATE.SELECT: {
                if (cc.dd.cardMgr.getIsCanOutCard()) {
                    if (cc.dd.cardMgr.getHuiPai()) {
                        if (cc.dd.cardMgr.getHuiPai() == this.id) {
                            cc.log(`会牌不可被打出`);
                            return;
                        }
                    }
                    cc.log(`发送出牌请求：${this.id}`);
                    const tingList = cc.dd.cardMgr.getTingList();
                    let tingPai = false;
                    if (tingList) {
                        tingList.forEach((item) => {
                            if (item == this.id) {
                                tingPai = true;
                            }
                        });
                    }
                    // 手牌更新
                    const cardList = cc.dd.cardMgr.getSelfHandCard();
                    for (let i = 0; i < cardList.length; i ++) {
                        if (cardList[i] === this.id) {
                            cardList.splice(i, 1);
                            break;
                        }
                    }
                    const handNode = cc.find("UI_ROOT").getComponent("mj_gameScene").playerArr[0].getChildByName("HandCardLayer").getChildByName("HandCardLay");
                    const moCard = cc.find("UI_ROOT").getComponent("mj_gameScene").playerArr[0].getChildByName("HandCardLayer").getChildByName("MoCardLayer");
                    moCard.children.forEach((item) => {
                        item.destroy();
                    });
                    cc.dd.cardMgr.setIsCanOutCard(false);
                    cc.dd.cardMgr.updateCard(handNode);


                    const suit = parseInt(this.id / 9) + 1;
                    const num = this.id % 9 + 1;
                    cc.dd.playEffect(1, num, suit);
                    const outCardNode = cc.find("UI_ROOT").getComponent("mj_gameScene").playerArr[0].getChildByName("OutCardLayer");
                    cc.dd.cardMgr.outCard(outCardNode, 1, this.id);

                    cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_OUTCARD_REP, {id: this.id, tingpai: tingPai});

                    // 处理直接更新手牌

                } else {
                    this.cancelSelect();
                }
                break;
            }
            case CARD_STATE.HAS_OUT: {
                cc.log(`麻将已经打出去了`);
                cc.dd.cardMgr.setIsCanOutCard(false);
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
