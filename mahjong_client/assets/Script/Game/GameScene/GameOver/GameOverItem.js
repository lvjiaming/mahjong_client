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
        NicknameLayout: {
            default: null,
            type: cc.Node,
            tooltip: "昵称的layout层",
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
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     *  初始化单个信息
     * @param data
     */
    initInfo(data) {
        this.Nickname.string = data.nickname;
        if (data.tags) {
            if (data.tags.indexOf("庄") != -1) {
                this.zhuangjia.active = true;
            }
            this.GameTag.string = data.tags;
        }else {
            this.GameTag.string = data.tags;
        }
        cc.dd.setPlayerHead(data.wx_portrait,this.PlayerAvatar);
        let nlayout = this.NicknameLayout;
        if(data.UID === cc.dd.room._winneruid) {
            cc.dd.Reload.loadAtlas("Game/Atlas/gameOverAl",(atlas) => {
                var node1 = new cc.Node('numstr1');
                var sp1 = node1.addComponent(cc.Sprite);
                sp1.spriteFrame = atlas.getSpriteFrame("js-miying@2x");
                nlayout.addChild(node1);
            });
        }
        if(data.UID === cc.dd.room._dianpaouid) {
            cc.dd.Reload.loadAtlas("Game/Atlas/gameOverAl",(atlas) => {
                var node1 = new cc.Node('numstr1');
                var sp1 = node1.addComponent(cc.Sprite);
                sp1.spriteFrame = atlas.getSpriteFrame("js-midp@2x");
                nlayout.addChild(node1);
            });
        }
        cc.dd.Reload.loadAtlas("Game/Atlas/num", (atlas) => {
            cc.dd.Reload.loadPrefab("Game/Prefab/ShowTime", (prefab) => {
                const ponitstr = cc.instantiate(prefab);
                ponitstr.getComponent("composeNum").initPoint(data.huscore,atlas);
                this.FristPoint.addChild(ponitstr);
            });
        });
        cc.dd.Reload.loadAtlas("Game/Atlas/num", (atlas) => {
            cc.dd.Reload.loadPrefab("Game/Prefab/ShowTime", (prefab) => {
                const ponitstr = cc.instantiate(prefab);
                ponitstr.getComponent("composeNum").initPoint(data.gangscore,atlas);
                this.SecondPoint.addChild(ponitstr);
            });
        });
    },
    // 黄局
    initHuangjuInfo(data) {
        this.Nickname.string = data.nickname;
        cc.dd.setPlayerHead(data.wx_portrait,this.PlayerAvatar);
        if (data.tags) {
            if (data.tags.indexOf("庄") != -1) {
                this.zhuangjia.active = true;
            }
            this.GameTag.string = data.tags;
        }else {
            this.GameTag.string = data.tags;
        }
        cc.dd.Reload.loadAtlas("Game/Atlas/num", (atlas) => {
            cc.dd.Reload.loadPrefab("Game/Prefab/ShowTime", (prefab) => {
                const ponitstr = cc.instantiate(prefab);
                ponitstr.getComponent("composeNum").initPoint(data.huscore,atlas);
                this.FristPoint.addChild(ponitstr);
            });
        });
        cc.dd.Reload.loadAtlas("Game/Atlas/num", (atlas) => {
            cc.dd.Reload.loadPrefab("Game/Prefab/ShowTime", (prefab) => {
                const ponitstr = cc.instantiate(prefab);
                ponitstr.getComponent("composeNum").initPoint(data.roomscore,atlas);
                this.SecondPoint.addChild(ponitstr);
            });
        });
    },
});
