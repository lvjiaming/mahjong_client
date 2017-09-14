/**
 * Created by Administrator on 2017/9/14.
 *  用于管理各种牌的操作
 */
const CardMgr = cc.Class({
    _canOutCard: false,  // 是否可以出牌
    _readyOutCard: null, // 选择准备出的牌
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
    },
    /**
     *  手牌的初始化
     * @param h_node 手牌的节点
     * @param localSeat 本地座位号
     * @param data 手牌数据（除了自己，其他只传手牌的数量）
     */
    initHandCard(h_node, localSeat, data) {
        switch (localSeat) {
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.BOTTOM: {
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT: {
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.TOP: {
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.LEFT: {
                break;
            }
            default: {
                cc.log(`未知的座位号：${localSeat}`);
            }
        }
    },
    /**
     *  玩家碰杠操作
     * @param p_node 碰杠的节点
     * @param localSeat 本地座位号
     * @param data 碰杠的数据（碰杠的牌）
     */
    pengGangCard(p_node, localSeat, data) {
        switch (localSeat) {
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.BOTTOM: {
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT: {
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.TOP: {
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.LEFT: {
                break;
            }
            default: {
                cc.log(`未知的座位号：${localSeat}`);
            }
        }
    },
    /**
     *  出牌的操作
     * @param o_node 出牌的节点
     * @param localSeat 本地座位号
     * @param data 出的牌
     */
    outCard(o_node, localSeat, data) {
        switch (localSeat) {
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.BOTTOM: {
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT: {
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.TOP: {
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.LEFT: {
                break;
            }
            default: {
                cc.log(`未知的座位号：${localSeat}`);
            }
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

});
cc.dd.cardMgr = CardMgr.getInstance();