cc.Class({
    extends: cc.Component,

    properties: {
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
    },
    setNickNameLabel(nickName) {
        this.NickNameLabel.string = nickName;
    },
});
