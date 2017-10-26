cc.Class({
    extends: cc.Component,

    properties: {
        PlayerAvatar: {
            default: null,
            type: cc.Sprite,
            tooltip: "玩家头像",
        },
        GameTag: {
            default: null,
            type: cc.Label,
            tooltip: "tag",
        },
        Nickname: {
            default: null,
            type: cc.Label,
            tooltip: "玩家昵称",
        },
        FristPoint: {
            default: null,
            type: cc.Node,
            tooltip: "胡得分",
        },
        SecondPoint: {
            default: null,
            type: cc.Node,
            tooltip: "杠得分",
        },
        zhuangjia: {
            default: null,
            type: cc.Node,
            tooltip: "庄家头像层",
        },
        dianpao: {
            default: null,
            type: cc.Node,
            tooltip: "点炮图标",
        },
        yingjia: {
            default: null,
            type: cc.Node,
            tooltip: "赢家图标",
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     *  初始化单个信息
     * @param data
     */
    initInfo(data) {
        cc.log(`初始化单个信息`);
        this.Nickname.string = data.nickname;
        this.GameTag.string = data.tags;
        // cc.dd.setPlayerHead(data.wx_portrait,this.PlayerAvatar);
        if(data.tags.indexOf("庄") != -1){
            this.zhuangjia.active = true;
        }

    },
});
