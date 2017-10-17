/**
 * Created by Administrator on 2017/9/14.
 *  用于管理各种牌的操作
 */

// 一些配置
const CONFIG = {
    BOTTOM: {
        OUT_CARD_X: 0,
        OUT_CARD_Y: 0,
        OUT_CARD_INIT_Y: 0,  // 出牌的第一张位置x为：-(length - 1) * 5.5
        PENG_GANG_X: 0,
    },
    RIGHT: {
        HAND_CARD_X: -11,
        HAND_CARD_Y: -32,
        HAND_CARD_INIT_Y: -50,
        PENG_GANG_X: 30,
        PENG_GANG_Y: 85,
        PENG_GANE_INIT_Y: 40,
        OUT_CARD_X: 5.5,
        OUT_CARD_Y: 22,
        OUT_CARD_INIT_Y: 33.5,  // 出牌的第一张位置x为：-(length - 1) * 5.5
    },
    TOP: {
        OUT_CARD_X: 0,
        OUT_CARD_Y: 0,
        OUT_CARD_INIT_Y: 0,  // 出牌的第一张位置x为：-(length - 1) * 5.5
        PENG_GANG_X: 0,
    },
    LEFT: {
        HAND_CARD_X: 11,
        HAND_CARD_Y: 32,
        HAND_CARD_INIT_Y: 50,  // 手牌第一场的初始位置x为: -(length - 1) * -11
        HAND_CARD_INIT_X: -133,
        PENG_GANG_X: -30,
        PENG_GANG_Y: -80,
        PENG_GANE_INIT_Y: -40,
        OUT_CARD_X: -5.5,
        OUT_CARD_Y: -22,
        OUT_CARD_INIT_Y: -33.5,
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
    _huiPai: null, // 会牌
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
                    card.setPosition(cc.p(i * CONFIG.RIGHT.HAND_CARD_X, CONFIG.RIGHT.HAND_CARD_INIT_Y + i * CONFIG.RIGHT.HAND_CARD_Y));
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
                    h_node.addChild(card, data - i);
                    const pos_x = CONFIG.LEFT.HAND_CARD_INIT_X + (i * CONFIG.LEFT.HAND_CARD_X);
                    const pos_y = CONFIG.LEFT.HAND_CARD_INIT_Y + (i * CONFIG.LEFT.HAND_CARD_Y);
                    card.setPosition(cc.p(pos_x, pos_y));
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
        if (cardList) {
            this.sortHandCard(cardList);
        }
        cardList.forEach((item, index) => {
            const str = "HandPoker";
            const card = cc.instantiate(cc.dd.dirRes[str.toUpperCase()]);
            card.getComponent("Card").id = item;
            card.cardId = item;
            if (this._huiPai == item) {
                card.getComponent("Card").isHuiPi = true;
            }
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
        // 摸牌的节点
        const moNode = p_node.parent.getChildByName("HandCardLayer").getChildByName("MoCardLayer");
        // 手牌节点
        const handNode = p_node.parent.getChildByName("HandCardLayer").getChildByName("HandCardLay");

        let needCre = true; // 明刚不需要重新生成牌堆

        // 碰杠需要销毁的牌数量
        let destoryNum = 2;
        // 碰或者杠的牌
        let pengOrGangId = null;
        switch (isGang) {
            case cc.dd.gameCfg.OPERATE_TYPE.PENG: {
                pengOrGangId = data.pengpai;
                break;
            }
            case cc.dd.gameCfg.OPERATE_TYPE.GANG: {
                pengOrGangId = data.gangpai;
                if (!data.angang) {
                    // needCre = false;
                    destoryNum = 3;
                } else {
                    destoryNum = 4;
                }
                break;
            }
            case cc.dd.gameCfg.OPERATE_TYPE.CHI: {
                if (!data.notDes) {
                    pengOrGangId = data.chipai;
                }
                break;
            }
            default: {
                cc.log(`类型不对!!`);
                return;
            }
        }
        let hasMo = false;
        if (moNode && !data.notDes) { // 将摸牌的节点里的牌清掉
            moNode.children.forEach((item) => {
                hasMo = true;
                item.destroy();
                destoryNum --;
            });
            moNode.removeAllChildren();
        }
        // 更新其他玩家的手牌
        const otherFunc = (handNode) => {
            if (!data.notDes) {
                if (!destoryNum) {
                    cc.log(`不需要删除!!`);
                    return;
                }
                for (let i = 0; i < destoryNum; i ++) {
                    const childNode = handNode.children;
                    let index = 0;
                    if (localSeat === cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT) {
                        index = childNode.length - 1;
                    }
                    childNode[index].destroy();
                    childNode[index].removeFromParent();
                }
            }
        };
        let pengGang = null;
        switch (localSeat) {
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.BOTTOM: {
                preStr = "PengGang";
                if (!data.notDes) {
                    for (let i = 0; i < destoryNum; i ++) {
                        for (let j = 0; this._selfHandCard.length; j ++) {
                            if (this._selfHandCard[j] == pengOrGangId) {
                                this._selfHandCard.splice(j, 1);
                                break;
                            }
                        }
                    }
                    this.updateCard(handNode);
                }
                if (needCre) {
                    pengGang = cc.instantiate(cc.dd.dirRes[preStr.toUpperCase()]);
                }
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT: {
                preStr = "PengGang_Left";
                otherFunc(handNode);
                if (needCre) {
                    pengGang = cc.instantiate(cc.dd.dirRes[preStr.toUpperCase()]);
                    const pos_x = p_node.childrenCount * CONFIG.RIGHT.PENG_GANG_X;
                    const pos_y = CONFIG.RIGHT.PENG_GANE_INIT_Y + (p_node.childrenCount * CONFIG.RIGHT.PENG_GANG_Y);
                    pengGang.setPosition(cc.p(pos_x, pos_y));
                }
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.TOP: {
                preStr = "PengGang_Top";
                otherFunc(handNode);
                if (needCre) {
                    pengGang = cc.instantiate(cc.dd.dirRes[preStr.toUpperCase()]);
                }
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.LEFT: {
                preStr = "PengGang_Left";
                otherFunc(handNode);
                if (needCre) {
                    pengGang = cc.instantiate(cc.dd.dirRes[preStr.toUpperCase()]);
                    const pos_x = p_node.childrenCount * CONFIG.LEFT.PENG_GANG_X;
                    const pos_y = CONFIG.LEFT.PENG_GANE_INIT_Y + (p_node.childrenCount * CONFIG.LEFT.PENG_GANG_Y);
                    pengGang.setPosition(cc.p(pos_x, pos_y));
                }
                break;
            }
            default: {
                cc.log(`未知的座位号：${localSeat}`);
            }
        }
        if (pengGang) {
            p_node.addChild(pengGang);
        }
        // } else {
        //     cc.log(`明刚，不需要生成牌堆`);
        //     const p_gNode = p_node.children;
        //     p_gNode.forEach((item) => {
        //         if (item.cardId === pengOrGangId) {
        //             if (item.getChildByName("GangCard")) {
        //                 item.getChildByName("GangCard").active = true;
        //             } else {
        //                 cc.log(`杠牌的节点为找到!!`);
        //             }
        //         }
        //     });
        //     return;
        // }
        const card = pengGang.children;
        if (isGang === cc.dd.gameCfg.OPERATE_TYPE.CHI) {
            cc.log(`吃的操作：`);
            let index = 0;
            card.forEach((item) => {
                if (item.name !== "AnGang" && item.name !== "GangCard") {
                    item.getComponent("CardSpr").initCard(data.straight[index]);
                    index ++;
                }
            });
            return;
        }
        pengGang.cardId = pengOrGangId;
        card.forEach((item) => {
            if (isGang === cc.dd.gameCfg.OPERATE_TYPE.GANG) {
                if (data.angang) {
                    if (item.name === "AnGang") {
                        item.active = true;
                    }
                } else {
                    if (item.name === "GangCard") {
                        item.active = true;
                    }
                }
            }
            if (item.name !== "AnGang") {
                if (isGang === cc.dd.gameCfg.OPERATE_TYPE.GANG) {
                    item.getComponent("CardSpr").initCard(data.gangpai);
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
    outCard(o_node, localSeat, data, notDes) {
        if (!data) {
            return;
        }
        const node1 = o_node.getChildByName("OutCardLayer1");
        const node2 = o_node.getChildByName("OutCardLayer2");
        const node3 = o_node.getChildByName("OutCardLayer3");
        const moNode = o_node.parent.getChildByName("HandCardLayer").getChildByName("MoCardLayer");
        const handNode = o_node.parent.getChildByName("HandCardLayer").getChildByName("HandCardLay");
        let hasMo = false;  // 标记是否是摸牌后出牌的
        if (moNode) { // 将摸牌的节点里的牌清掉
            moNode.children.forEach((item) => {
                hasMo = true;
                item.destroy();
            });
            moNode.removeAllChildren();
        }
        // 其他玩家出牌
        const otherDes = (handNode) => {
            const childNode = handNode.children;
            if (!hasMo && !notDes) {
                let index = 0;
                if (localSeat === cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT) {
                   index = childNode.length - 1;
                }
                childNode[index].destroy();
                childNode[index].removeFromParent();
            }
        };
        let str = "";
        let preConfif = null;
        switch (localSeat) {
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.BOTTOM: {
                // 更新手牌数组
                str = "OutCard_Bottom";
                preConfif = CONFIG.BOTTOM;
                if (!notDes) {
                    for (let i = 0; i < this._selfHandCard.length; i ++) {
                        if (this._selfHandCard[i] === data) {
                            this._selfHandCard.splice(i, 1);
                            break;
                        }
                    }
                    this.updateCard(handNode);
                }
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT: {
                str = "OutCard_Left";
                preConfif = CONFIG.RIGHT;
                otherDes(handNode);
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.TOP: {
                str = "OutCard_Top";
                preConfif = CONFIG.TOP;
                otherDes(handNode);
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.LEFT: {
                str = "OutCard_Left";
                preConfif = CONFIG.LEFT;
                otherDes(handNode);
                break;
            }
            default: {
                cc.log(`未知的座位号：${localSeat}`);
            }
        }
        const outCard = cc.instantiate(cc.dd.dirRes[str.toUpperCase()]);
        if (outCard) {
            outCard.getComponent("CardSpr").initCard(data);
            let addNode = null;
            let pos_x = 0; // 牌的x位置
            let pos_y = 0; // 牌的y位置
            let pos_init_x = 0; // 第一张牌的x位置
            let pos_init_y = preConfif.OUT_CARD_INIT_Y; // 第一张牌的y位置
            let index_z = null;
            if (node1.childrenCount < CONFIG.OUT_CARD_NUM.LAYER_ONE) {
                addNode = node1;
                if (localSeat === cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT) {
                    pos_init_x = -(CONFIG.OUT_CARD_NUM.LAYER_ONE - 1) * preConfif.OUT_CARD_X;
                    index_z = CONFIG.OUT_CARD_NUM.LAYER_ONE - addNode.childrenCount;
                }
                pos_x = pos_init_x + (addNode.childrenCount * preConfif.OUT_CARD_X);
                pos_y = pos_init_y + (addNode.childrenCount * preConfif.OUT_CARD_Y);
                outCard.setPosition(cc.p(pos_x, pos_y));
            } else if (node2.childrenCount < CONFIG.OUT_CARD_NUM.LAYER_TWO) {
                addNode = node2;
                if (localSeat === cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT) {
                    pos_init_x = -(CONFIG.OUT_CARD_NUM.LAYER_TWO - 1) * preConfif.OUT_CARD_X;
                    index_z = CONFIG.OUT_CARD_NUM.LAYER_TWO - addNode.childrenCount;
                }
                pos_x = pos_init_x + (addNode.childrenCount * preConfif.OUT_CARD_X);
                pos_y = pos_init_y + (addNode.childrenCount * preConfif.OUT_CARD_Y);
                outCard.setPosition(cc.p(pos_x, pos_y));
                outCard.setPositionX(node2.childrenCount * preConfif.OUT_CARD_X);
            } else {
                addNode = node3;
                if (localSeat === cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT) {
                    pos_init_x = -(CONFIG.OUT_CARD_NUM.LAYER_THREE - 1) * preConfif.OUT_CARD_X;
                    index_z = CONFIG.OUT_CARD_NUM.LAYER_THREE - addNode.childrenCount;
                }
                pos_x = pos_init_x + (addNode.childrenCount * preConfif.OUT_CARD_X);
                pos_y = pos_init_y + (addNode.childrenCount * preConfif.OUT_CARD_Y);
                outCard.setPosition(cc.p(pos_x, pos_y));
                cc.log(`节点名字:${node3.name}, 子节点：${node3.childrenCount}`);
                outCard.setPositionX(node3.childrenCount * preConfif.OUT_CARD_X);
            }
            if (index_z) {
                addNode.addChild(outCard, index_z);
            } else {
                addNode.addChild(outCard);
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
                if (data.mopai !== true) {
                    const str = "HandPoker";
                    const card = cc.instantiate(cc.dd.dirRes[str.toUpperCase()]);
                    card.getComponent("Card").id = data.mopai;
                    card.cardId = data.mopai;
                    m_node.addChild(card);
                    this._selfHandCard.push(data.mopai);
                }
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
     *  设置会牌
     * @param id 牌的id
     */
    setHuiPai(id) {
        this._huiPai = id;
    },
    /**
     *  得到会牌
     * @returns {null}
     */
    getHuiPai() {
        return this._huiPai;
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
    updateCard(handNode) {
        handNode.children.forEach((item) => {
            item.destroy();
        });
        handNode.removeAllChildren(true);
        this.initSelfHandCard(handNode, this._selfHandCard);
        // 将选中牌赋予空
        this.setReadyOutCard(null);
    },

});
cc.dd.cardMgr = CardMgr.getInstance();