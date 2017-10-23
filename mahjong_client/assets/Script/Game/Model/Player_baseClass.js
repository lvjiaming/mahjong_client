
cc.Class({
    extends: cc.Component,
    properties: {
        // 节点
        NickNameLabel: {
            default: null,
            type: cc.Label,
            tooltip: "昵称",
        },
        HeadNode: {
            default: null,
            type: cc.Sprite,
            tooltip: "头像"
        },
        CoinLabel: {
            default: null,
            type: cc.Label,
            tooltip: "金币",
        },
        HandCardNode: {
            default: null,
            type: cc.Node,
            tooltip: "手牌节点",
        },
        PengGangNode: {
            default: null,
            type: cc.Node,
            tooltip: "碰刚的节点",
        },
        OutCardNode: {
            default: null,
            type: cc.Node,
            tooltip: "出牌的节点",
        },
        MoCardNode: {
            default: null,
            type: cc.Node,
            tooltip: "摸牌的节点",
        },
        IPAdressLabel: {
            default: null,
            type: cc.Label,
            tooltip: "ip地址相同的需要显示出来",
        },
        // 数据
        _HandCardArr: [], // 手牌数组
        _PengCardArr: [], // 碰牌数组
        _GangCardArr: [], // 杠牌数组
        _LocalSeat: 1,
    },
    /**
     *  初始化玩家基本信息
     * @param data 数据
     */
    initInfo(data) {
        this.setLocalSeat();
        this.setNickNameLabel(data.nickname);
        this.setCoinLabel(data.score);
        this.setHeadSpr(data.wx_portrait);
    },
    /**
     *  设置玩家的本地桌位号
     * @param seat
     */
    setLocalSeat(seat) {
        this._LocalSeat = seat;
    },
    getLocalSeat() {
        return this._LocalSeat;
    },
    /**
     *  设置昵称
     * @param nickName 昵称
     */
    setNickNameLabel(nickName) {
        if (this.NickNameLabel) {
            this.NickNameLabel.string = nickName;
        }
    },
    /**
     *  设置金币
     * @param coin 金币
     */
    setCoinLabel(coin) {
        if (this.CoinLabel) {
            this.CoinLabel.string = coin;
        }
    },
    /**
     * 设置头像
     */
    setHeadSpr(url) {
        cc.dd.setPlayerHead(url,this.HeadNode)
    },
    /**
     *  生成手牌
     * @param data
     */
    createHandCard(data) {
        if (this.HandCardNode) {
            cc.log(`生成玩家${this._LocalSeat}的手牌`);
            cc.dd.cardMgr.initHandCard(this.HandCardNode, this._LocalSeat, data);
        } else {
            cc.log(`手牌节点为空`);
        }
    },
    /**
     *  玩家摸牌
     * @param data
     */
    moCard(data) {
        if (this.MoCardNode) {
            cc.log(`玩家${this._LocalSeat}摸牌`);
            cc.dd.cardMgr.MoCard(this.MoCardNode, this._LocalSeat, data);
        } else {
            cc.log(`摸牌节点为空`);
        }
    },
    /**
     *  玩家出牌
     * @param data
     * @constructor
     */
    outCard(data) {
        if (this.OutCardNode) {
            cc.log(`玩家${this._LocalSeat}出牌`);
            cc.dd.cardMgr.outCard(this.OutCardNode, this._LocalSeat, data);
        } else {
            cc.log(`出牌节点为空`);
        }
    },
    /**
     *  玩家碰刚
     * @param data
     */
    pengGangCard(data) {
        if (this.PengGangNode) {
            cc.log(`玩家${this._LocalSeat}进行碰刚操作`);
            cc.dd.cardMgr.pengGangCard(this.PengGangNode, this._LocalSeat, data);
        } else {
            cc.log(`碰刚节点为空`);
        }
    },
});
