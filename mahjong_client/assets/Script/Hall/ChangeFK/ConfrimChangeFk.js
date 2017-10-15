cc.Class({
    extends: cc.Component,

    properties: {
        fangkaAmountLabel: {
            default: null,
            type: cc.Label,
            tooltip: "您确认转让张房卡给玩家",
        },
        recieverNameLabel: {
            default: null,
            type: cc.Label,
            tooltip: "玩家名",
        },
        recieverAvatar: {
            default: null,
            type: cc.Sprite,
            tooltip: "玩家头像",
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    onCancleClick() {
        this.node.destroy();
    },
    onComfrimClick() {

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
