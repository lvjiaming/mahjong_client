// 玩家的一些配置
const CONFIG = {
    BOTTOM: {

    },
    RIGHT: {

    },
    TOP: {

    },
    LEFT: {

    },
};
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
        // 数据
        _HandCardArr: [], // 手牌数组
        _PengCardArr: [], // 碰牌数组
        _GangCardArr: [], // 杠牌数组
    },
    /**
     *  初始化玩家基本信息
     * @param data 数据
     */
    initInfo(data) {

    },
    /**
     *  设置昵称
     * @param nickName 昵称
     */
    setNickNameLabel(nickName) {
        this.NickNameLabel.string = nickName;
    },
    /**
     *  设置金币
     * @param coin 金币
     */
    setCoinLabel(coin) {
        this.CoinLabel.string = coin;
    },
    /**
     * 设置头像
     */
    setHeadSpr() {

    },
});
