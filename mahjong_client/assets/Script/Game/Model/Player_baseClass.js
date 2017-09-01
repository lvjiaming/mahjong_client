// 玩家的一些配置
const CONFIG = {

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
        // 数据
        _HandCardArr: [], // 手牌数组
        _PengCardArr: [], // 碰牌数组
        _GangCardArr: [], // 杠牌数组
    },
    setNickNameLabel(nickName) {
        this.NickNameLabel.string = nickName;
    },
});
