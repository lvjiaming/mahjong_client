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
        OUT_CARD_Y: 27,
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
        OUT_CARD_Y: -27,
        OUT_CARD_INIT_Y: -33.5,
    },
    // 出牌的每层里牌的张数
    OUT_CARD_NUM: {
        LAYER_ONE: 7,
        LAYER_TWO: 7,
        LAYER_THREE: 4,
    },
    LIGHTUP_AREA: {
        OUTCARDLAYER: "out_card",
        CHICARDLAYER: "chi_card",
        PENGCARDLAYER: "peng_card",
    },
};
const CardMgr = cc.Class({
    _canOutCard: false,  // 是否可以出牌
    _readyOutCard: null, // 选择准备出的牌
    _selfHandCard: null, // 玩家自己的手牌
    _huiPai: null, // 会牌
    _chiList: null,  // 吃牌的列表
    _tingList: null, // 听牌的列表
    _isTing: null, // 是否是听牌
    _moCard: null, // 摸的牌
    _ziMoGangCard: null, // 自摸杠的牌
    _CurOutCard: null, // 当前出的牌
    _CurZiMoGangCard: null, // 当前自摸杠的牌
    _SelfPlayerNode: null, // 自己玩家的节点
    _lightupNodeArr: null, // 飙蓝的牌
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
        this._isTing = false;
        this._moCard = null;
        this._lightupNodeArr = [];
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
                this._SelfPlayerNode = h_node.parent.parent;
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
        if(cardList) {
            cardList.forEach((item, index) => {
                const str = "HandPoker";
                const card = cc.instantiate(cc.dd.dirRes[str.toUpperCase()]);
                card.getComponent("Card").id = item;
                card.cardId = item;
                card.getChildByName("TingSign").active = false;
                if (this._huiPai == item) {
                    card.getComponent("Card").isHuiPi = true;
                }
                h_node.addChild(card, index + 1);
            });
        }
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
        cc.log(`杠牌的信息：`, JSON.stringify(data));
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
                if (data.mopaigang) {
                    if (data.gangpai !== -1) {
                        pengOrGangId = data.gangpai;
                    } else {
                        pengOrGangId = this.getMoCard();
                        pengOrGangId = this.getCurZiMoGangCard();
                        this.setCurZiMoGangCard(null);
                    }
                    data.angang = true;
                }
                if (!data.angang) {
                    // needCre = false;
                    destoryNum = 3;
                } else {
                    if (localSeat !== 1) {
                        destoryNum = 4;
                    } else {
                        destoryNum = 4;
                    }
                }
                break;
            }
            case cc.dd.gameCfg.OPERATE_TYPE.CHI: {
                pengOrGangId = data.straight;
                break;
            }
            default: {
                cc.log(`类型不对!!`);
                return;
            }
        }
        const p_childNode = p_node.children;
        if (p_childNode) {
            p_childNode.forEach((item) => {
                if (item.cardId == pengOrGangId && item.cardId !== -1) {
                    needCre = false;
                    destoryNum = 1;
                    item.getChildByName("GangCard").active = true;
                }
            });
        }
        let hasMo = false;
        if (moNode && !data.notDes) { // 将摸牌的节点里的牌清掉
            let hasDestroy = false;
            moNode.children.forEach((item) => {
                if (!hasDestroy) {
                    destoryNum --;
                    // if (isGang == cc.dd.gameCfg.OPERATE_TYPE.GANG && data.angang) {
                    //     if (item.cardId != pengOrGangId) {
                    //         destoryNum++;
                    //     }
                    // }
                    hasMo = true;
                    item.destroy();
                    hasDestroy = true;
                }
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
                cc.log(`杠牌轮到自己操作`);
                preStr = "PengGang";
                if (!data.notDes) {
                    if (isGang !== cc.dd.gameCfg.OPERATE_TYPE.CHI) {
                        for (var i = 0; i < destoryNum; i ++) {
                            for (var j = 0; j < this._selfHandCard.length; j ++) {
                                if (this._selfHandCard[j] == pengOrGangId) {
                                    this._selfHandCard.splice(j, 1);
                                    break;
                                }
                            }
                        }
                        if (data.angang) {
                            for (let index = 0; index < this._selfHandCard.length; index ++) {
                                if (this._selfHandCard[index] == pengOrGangId) {
                                    this._selfHandCard.splice(index, 1);
                                    break;
                                }
                            }
                        }
                        if (!needCre) {
                            this._selfHandCard.forEach((id, index) => {
                                if (id == pengOrGangId) {
                                    this._selfHandCard.splice(index, 1);
                                }
                            });
                        }
                    } else {
                        for (let i = 0; i < pengOrGangId.length; i ++) {
                            for (let j = 0; j < this._selfHandCard.length; j++) {
                                if (pengOrGangId[i] == this._selfHandCard[j] && pengOrGangId[i] != data.chipai) {
                                    this._selfHandCard.splice(j, 1);
                                    break;
                                }
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
        if (!needCre) {
            return;
        }
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
            if (!data.notDes) {
                cc.log(`将牌清掉`);
                if (this.getCurOutCard()) {
                    this.getCurOutCard().removeFromParent(true);
                    this.getCurOutCard().destroy();
                    this.setCurOutCard(null);
                }
            }
            return;
        }
        pengGang.cardId = pengOrGangId;
        card.forEach((item) => {
            if (isGang === cc.dd.gameCfg.OPERATE_TYPE.GANG) {
                if (data.angang) {
                    if (item.name === "AnGang") {
                        item.active = true;
                    }
                    if (item.name !== "GangCard" && item.name !== "AnGang") {
                        item.getChildByName("bk").active = true;
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
        if (isGang === cc.dd.gameCfg.OPERATE_TYPE.GANG) {
            if (localSeat === cc.dd.gameCfg.PLAYER_SEAT_LOCAL.BOTTOM) {
                if (data.angang) {
                    const gang = pengGang.getChildByName("GangCard");
                    const angang = pengGang.getChildByName("AnGang");
                    gang.active = true;
                    angang.active = false;
                    gang.getComponent("CardSpr").initCard(pengOrGangId);
                }
            }
        }
        if (!data.notDes) {
            cc.log(`将牌清掉`);
            if (this.getCurOutCard()) {
                this.getCurOutCard().removeFromParent(true);
                this.getCurOutCard().destroy();
                this.setCurOutCard(null);
            }
        }
    },
    /**
     *  出牌的操作
     * @param o_node 出牌的节点
     * @param localSeat 本地座位号
     * @param data 出的牌
     */
    outCard(o_node, localSeat, data, notDes) {
        if (data == null) {
            return;
        }
        if (this.getCurOutCard()) {
            this.getCurOutCard().getChildByName("Sign").active = false;
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
                        if (data == this._selfHandCard[i]) {
                            this._selfHandCard.splice(i, 1);
                            break;
                        }
                    }
                }
                this.updateCard(handNode);
                // if (!notDes) {
                //
                // }
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
            outCard.getChildByName("Sign").active = true;
            this.setCurOutCard(outCard);
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
                if (data.mopai !== true && data.mopai !== -1) {
                    this.setMoCard(data.mopai);
                    const str = "HandPoker";
                    const card = cc.instantiate(cc.dd.dirRes[str.toUpperCase()]);
                    // 听啤的标志
                    if (cc.dd.cardMgr.getTingList()) {
                        let hasTing = false;
                        if (!cc.dd.cardMgr.getIsTing()) {
                            cc.dd.cardMgr.getTingList().forEach((item) => {
                                if (item == data.mopai) {
                                    card.getChildByName("TingSign").active = true;
                                    hasTing = true;
                                }
                                // if (hasTing) {
                                //     cc.dd.Reload.loadPrefab("Game/Prefab/BuTing", (prefab) => {
                                //         const buting = cc.instantiate(prefab);
                                //         this.node.addChild(buting);
                                //     });
                                // }
                            });
                        }
                    }
                    card.getComponent("Card").id = data.mopai;
                    card.cardId = data.mopai;
                    if (this._huiPai == data.mopai) {
                        card.getComponent("Card").isHuiPi = true;
                    }
                    m_node.addChild(card);
                    this._selfHandCard.push(data.mopai);
                }
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT: {
                preStr = "HandCard_Left";
                this.setMoCard(null);
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.TOP: {
                preStr = "HandCard_Top";
                this.setMoCard(null);
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.LEFT: {
                preStr = "HandCard_Left";
                this.setMoCard(null);
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
     * 设置吃牌列表
     */
    setChiList(list) {
        this._chiList = list;
    },
    /**
     *  得到吃牌列表
     */
    getChiList() {
        return this._chiList;
    },
    /**
     * 设置听牌列表
     */
    setTingList(list) {
        this._tingList = list;
    },
    /**
     *  得到吃牌列表
     */
    getTingList() {
        return this._tingList;
    },
    /**
     * 设置听
     */
    setIsTing(isTing) {
        this._isTing = isTing;
    },
    /**
     *  得到听
     */
    getIsTing() {
        return this._isTing;
    },
    /**
     * 设置摸牌
     */
    setMoCard(card) {
        this._moCard = card;
    },
    /**
     *  得到摸牌
     */
    getMoCard() {
        return this._moCard;
    },
    /**
     * 设置自摸杠牌
     */
    setZiMoGang(card) {
        this._ziMoGangCard = card;
    },
    /**
     *  得到自摸杠牌
     */
    getZiMoGang() {
        return this._ziMoGangCard;
    },
    /**
     * 设置当前出牌
     */
    setCurOutCard(card) {
        this._CurOutCard = card;
    },
    /**
     *  得到当前出牌
     */
    getCurOutCard() {
        return this._CurOutCard;
    },
    /**
     *  得到玩家的手牌数组
     */
    getSelfHandCard() {
        return this._selfHandCard;
    },
    /**
     *  当前自摸杠的牌
     * @param card
     */
    setCurZiMoGangCard(card) {
        this._CurZiMoGangCard = card;
    },
    getCurZiMoGangCard () {
        return this._CurZiMoGangCard;
    },
    /**
     *  得到听得按钮状态
     */
    getTingBtnState() {
        let state = null;
        if (this._SelfPlayerNode) {
            state = this._SelfPlayerNode.getComponent("PlayerSelf").getTingBtnState();
        }
        return state;
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
            // cc.log(`排序后的手牌数组为：${item}`);
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
    /**
     *  飚蓝与手牌选中的牌，相同的牌
     */
    singleOutSeletedHandCardSimilarOutCard(carid) {
        let haspeng = false;
        // 遍历碰杠
        cc.dd.room._playerNodeArr.forEach((pitem,pindex,parr) => {
            const pengchinode = pitem.getChildByName("PengGangLayer");
            if(pengchinode.children.length > 0) {
                pitem.outPengArr.forEach((mitem,mindex) => {
                    if(Array.isArray(mitem)){
                        pengchinode.children[mindex].children.forEach((item,index) => {
                            if(item.getComponent("CardSpr").id === carid){
                                item.getChildByName("blueMask").active = true;
                                this._lightupNodeArr.push(item);
                            }
                        });
                    }else {
                        if(mitem === carid) {
                            haspeng = true;
                            pengchinode.children[mindex].children.forEach((item,index) => {
                                if(index <=2){
                                    item.getChildByName("blueMask").active = true;
                                    this._lightupNodeArr.push(item);
                                }
                            });
                        }
                    }
                });
            }
        });
        if (haspeng) {
            cc.log("有碰不需要继续");
            return;
        }
        // 遍历出牌，有无一样的
        cc.dd.room._playerNodeArr.forEach((pitem,pindex,parr) => {
            const outNode = parr[pindex].getChildByName("OutCardLayer");
            if (outNode.children.length > 0) {
                outNode.children.forEach((mitem) => {
                    if(mitem.children.length > 0) {
                        mitem.children.forEach((item,index) => {
                            if(item.getComponent("CardSpr").id === carid){// 出牌的prefab没有绑定id
                                this._lightupNodeArr.push(item);
                                item.getChildByName("blueMask").active = true;
                            }
                        });
                    }
                });
            }
        });
    },
    cancelSingleOutMask() {
        if(this._lightupNodeArr.length > 0) {
            this._lightupNodeArr.forEach((item) => {
                item.getChildByName("blueMask").active = false;
            });
            this._lightupNodeArr = [];
            cc.log(this._lightupNodeArr.length);
        }
    },
    lightUpBlueMask(area,pnode,index) { // 弃用
        switch (area){
            case CONFIG.LIGHTUP_AREA.OUTCARDLAYER: {
                if(index <= 6) {
                    let target = pnode.getChildByName("OutCardLayer1").children[index];
                    this._lightupNodeArr.push(target);
                    target.getChildByName("blueMask").active = true;
                }else if(index - 12 >= 1 ) {
                    let target = pnode.getChildByName("OutCardLayer1").children[index-12];
                    this._lightupNodeArr.push(target);
                    target.getChildByName("blueMask").active = true;
                }else {
                    let target = pnode.getChildByName("OutCardLayer1").children[index-6];
                    this._lightupNodeArr.push(target);
                    target.getChildByName("blueMask").active = true;
                }
                break;
            }
            case CONFIG.LIGHTUP_AREA.PENGCARDLAYER: {
                cc.log("碰的牌"+index);
                break;
            }
            case CONFIG.LIGHTUP_AREA.CHICARDLAYER: {
                break;
            }
            default: {
                cc.log("未知区域");
            }
        }
    },
});
cc.dd.cardMgr = CardMgr.getInstance();