/**
 * Created by Administrator on 2017/9/14.
 *  用于管理各种牌的操作
 */

// 一些配置
const CONFIG = {
    BOTTOM: {
        OUT_CARD_X: 0,
        PENG_GANG_X: 0,
    },
    RIGHT: {
        HAND_CARD_X: -11,
        PENG_GANG_X: 30,
        OUT_CARD_X: -5.5,
        OUT_CARD_INIT_X: 1,
    },
    TOP: {
        OUT_CARD_X: 0,
        PENG_GANG_X: 0,
    },
    LEFT: {
        HAND_CARD_X: -11,
        PENG_GANG_X: -30,
        OUT_CARD_X: -5.5,
        OUT_CARD_INIT_X: 1,
    },
    // 出牌的每层里牌的张数
    OUT_CARD_NUM: {
        LAYER_ONE: 13,
        LAYER_TWO: 11,
        LAYER_THREE: 9,
    },
};
const CardMgr = cc.Class({
    _canOutCard: false,  // 是否可以出牌
    _readyOutCard: null, // 选择准备出的牌
    _selfHandCard: null, // 玩家自己的手牌
    statics: {
        getInstance() {
            if (!this.cardMgr) {
                this.cardMgr = new CardMgr();
            }
            return this.cardMgr;
        },
    },
    ctor() {
        this._canOutCard = false;
        this._readyOutCard = null;
        this._selfHandCard = [];
    },
    /**
     *  手牌的初始化
     * @param h_node 手牌的节点
     * @param localSeat 本地座位号
     * @param data 手牌数据（除了自己，其他只传手牌的数量）
     */
    initHandCard(h_node, localSeat, data) {
        cc.log(`初始化本地座位号为${localSeat}玩家的手牌`);
        switch (localSeat) {
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.BOTTOM: {
                this.initSelfHandCard(h_node, data);
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT: {
                let initPos = 0;
                const str = "HandCard_Left";
                for (let i = 0; i < data; i ++) {
                    const card = cc.instantiate(cc.dd.dirRes[str.toUpperCase()]);
                    h_node.addChild(card);
                    if (i === 0) {
                        initPos = card.getPositionX();
                    }
                    card.setPositionX(initPos + (i * CONFIG.RIGHT.HAND_CARD_X));
                }
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.TOP: {
                const str = "HandCard_Top";
                for (let i = 0; i < data; i ++) {
                    const card = cc.instantiate(cc.dd.dirRes[str.toUpperCase()]);
                    h_node.addChild(card);
                }
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.LEFT: {
                let initPos = 0;
                const str = "HandCard_Left";
                for (let i = 0; i < data; i ++) {
                    const card = cc.instantiate(cc.dd.dirRes[str.toUpperCase()]);
                    h_node.addChild(card);
                    if (i === 0) {
                        initPos = card.getPositionX();
                    }
                    card.setPositionX(initPos + (i * CONFIG.LEFT.HAND_CARD_X));
                }
                break;
            }
            default: {
                cc.log(`未知的座位号：${localSeat}`);
            }
        }
    },
    /**
     *  初始化自己的手牌
     */
    initSelfHandCard(h_node, cardList) {
        this._selfHandCard = cardList;
        this.sortHandCard(cardList);
        cardList.forEach((item, index) => {
            const str = "HandPoker";
            const card = cc.instantiate(cc.dd.dirRes[str.toUpperCase()]);
            card.getComponent("Card").id = item;
            card.cardId = item;
            h_node.addChild(card, index + 1);
        });
    },
    /**
     *  玩家碰杠操作
     * @param p_node 碰杠的节点
     * @param localSeat 本地座位号
     * @param data 碰杠的数据（碰杠的牌）
     * @param isGang 是否为杠
     */
    pengGangCard(p_node, localSeat, data, isGang) {
        let preStr = "";
        let selfConfig = null;
        switch (localSeat) {
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.BOTTOM: {
                preStr = "PengGang";
                selfConfig = CONFIG.BOTTOM;
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT: {
                preStr = "PengGang_Left";
                selfConfig = CONFIG.RIGHT;
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.TOP: {
                preStr = "PengGang_Top";
                selfConfig = CONFIG.TOP;
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.LEFT: {
                preStr = "PengGang_Left";
                selfConfig = CONFIG.LEFT;
                break;
            }
            default: {
                cc.log(`未知的座位号：${localSeat}`);
            }
        }
        const pengGang = cc.instantiate(cc.dd.dirRes[preStr.toUpperCase()]);
        pengGang.setPositionX(p_node.childrenCount * selfConfig.PENG_GANG_X);
        p_node.addChild(pengGang);
        const card = pengGang.children;
        card.forEach((item) => {
            if (isGang) {

            } else {
                if (item.name == "GangCard") {
                    item.active = false;
                } else {
                    item.getComponent("CardSpr").initCard(data.pengpai);
                }
            }
        });
    },
    /**
     *  出牌的操作
     * @param o_node 出牌的节点
     * @param localSeat 本地座位号
     * @param data 出的牌
     */
    outCard(o_node, localSeat, data) {
        const node1 = o_node.getChildByName("OutCardLayer1");
        const node2 = o_node.getChildByName("OutCardLayer2");
        const node3 = o_node.getChildByName("OutCardLayer3");
        const moNode = o_node.parent.getChildByName("HandCardLayer").getChildByName("MoCardLayer");
        let hasMo = false;  // 标记是否是摸牌后出牌的
        if (moNode) { // 将摸牌的节点里的牌清掉
            moNode.children.forEach((item) => {
                hasMo = true;
                item.destroy();
            });
        }
        let str = "";
        let preConfif = null;
        switch (localSeat) {
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.BOTTOM: {
                // 更新手牌数组
                for (let i = 0; i < this._selfHandCard.length; i ++) {
                    if (this._selfHandCard[i] === data) {
                        this._selfHandCard.splice(i, 1);
                        break;
                    }
                }
                str = "OutCard_Bottom";
                preConfif = CONFIG.BOTTOM;
                const handNode = o_node.parent.getChildByName("HandCardLayer").getChildByName("HandCardLay");
                handNode.children.forEach((item) => {
                    item.destroy();
                });
                this.initSelfHandCard(handNode, this._selfHandCard);
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT: {
                str = "OutCard_Left";
                preConfif = CONFIG.RIGHT;
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.TOP: {
                str = "OutCard_Top";
                preConfif = CONFIG.TOP;
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.LEFT: {
                str = "OutCard_Left";
                preConfif = CONFIG.LEFT;
                break;
            }
            default: {
                cc.log(`未知的座位号：${localSeat}`);
            }
        }
        const outCard = cc.instantiate(cc.dd.dirRes[str.toUpperCase()]);
        if (outCard) {
            outCard.getComponent("CardSpr").initCard(data);
            if (node1.childrenCount < CONFIG.OUT_CARD_NUM.LAYER_ONE) {
                outCard.setPositionX(node1.childrenCount * preConfif.OUT_CARD_X);
                node1.addChild(outCard);
            } else if (node2.childrenCount < CONFIG.OUT_CARD_NUM.LAYER_TWO) {
                outCard.setPositionX(node2.childrenCount * preConfif.OUT_CARD_X);
                node2.addChild(outCard);
            } else {
                cc.log(`节点名字:${node3.name}, 子节点：${node3.childrenCount}`)
                outCard.setPositionX(node3.childrenCount * preConfif.OUT_CARD_X);
                node3.addChild(outCard);
            }
        }
    },
    /**
     *  摸牌的方法
     * @param m_node 摸牌的节点
     * @param localSeat 玩家的本地座位号
     * @param data 摸的牌
     * @constructor
     */
    MoCard(m_node, localSeat, data) {
        let preStr = null;
        switch (localSeat) {
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.BOTTOM: {
                const str = "HandPoker";
                const card = cc.instantiate(cc.dd.dirRes[str.toUpperCase()]);
                card.getComponent("Card").id = data.mopai;
                card.cardId = data.mopai;
                m_node.addChild(card);
                this._selfHandCard.push(data.mopai);
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT: {
                preStr = "HandCard_Left";
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.TOP: {
                preStr = "HandCard_Top";
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.LEFT: {
                preStr = "HandCard_Left";
                break;
            }
            default: {
                cc.log(`未知的座位号：${localSeat}`);
            }
        }
        if (preStr) {
            const mocard = cc.instantiate(cc.dd.dirRes[preStr.toUpperCase()]);
            m_node.addChild(mocard);
        }
    },
    /**
     *  设置是否能出牌
     * @param state
     */
    setIsCanOutCard(state) {
        this._canOutCard = state;
    },
    /**
     *  得到是否能出牌
     */
    getIsCanOutCard() {
        return this._canOutCard;
    },
    /**
     *  设置准备出的牌
     * @param card 牌
     */
    setReadyOutCard(card) {
        this._readyOutCard = card;
    },
    /**
     *  得到准备出的牌
     */
    getReadyOutCard() {
        return this._readyOutCard;
    },
    /**
     *  排序手牌
     * @param data
     */
    sortHandCard(data) {
        for (let i = 0; i < data.length - 1; i++) {
            for (let j = i + 1; j < data.length; j++) {
                if (data[i] > data[j]) {
                    let a = data[i];
                    data[i] = data[j];
                    data[j] = a;
                }
            }
        }
        data.forEach((item) => {
            cc.log(`排序后的手牌数组为：${item}`);
        });
    },
    /**
     *  更新牌
     */
    updateCard() {
        for (let i = 0; i < this._selfHandCard.length; i++) {
            if (card.cardId <= this._selfHandCard[i].cardId) {
                this._selfHandCard.push();
                break;
            }
        }
    },

});
cc.dd.cardMgr = CardMgr.getInstance();