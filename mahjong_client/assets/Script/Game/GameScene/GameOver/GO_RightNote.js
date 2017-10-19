const HU_TYPE_NAME = [
    null,
    "zimo",
    "pinghu",
    "sihui",
    "duibao",
    "loubao",
    "gangshanghua"
];
cc.Class({
    extends: cc.Component,

    properties: {
        NickNameLabel: {
            default: null,
            type: cc.Label,
            tooltip: "昵称",
        },
        SocreLabel: {
            default: null,
            type: cc.Label,
            tooltip: "分数",
        },
        ZhuangNode: {
            default: null,
            type: cc.Node,
            tooltip: "庄",
        },
        HeadNoe: {
            default: null,
            type: cc.Sprite,
            tooltip: "头像",
        },
        DianPao: {
            default: null,
            type: cc.Node,
            tooltip: "点炮",
        },
        HuType: {
            default: null,
            type: cc.Sprite,
            tooltip: "胡的类型",
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     *  初始化内容
     */
    initNote(data, otherData) {
        if (this.NickNameLabel) {
            this.NickNameLabel.string = data.nickname;
        }
        if (this.SocreLabel) {
            this.SocreLabel.string = data.huscore;
        }
        if (this.ZhuangNode) {
            this.ZhuangNode.active = data.isbanker;
        }
        if (this.DianPao) {
            if (data.UID == otherData.dianpaouid) {
                this.DianPao.active = true;
            }
        }
        if (this.HuType) {
            cc.dd.Reload.loadAtlas("Game/Atlas/gameOver", (atlas) => {
                if (data.UID == otherData.huuid) {
                    this.HuType.spriteFrame = atlas.getSpriteFrame(HU_TYPE_NAME[otherData.hutype]);
                }
            });
        }
    },
});
