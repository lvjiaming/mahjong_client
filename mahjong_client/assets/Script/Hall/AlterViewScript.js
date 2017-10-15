cc.Class({
    extends: cc.Component,

    properties: {
        MesLabel: {
            default: null,
            type: cc.Label,
            tooltip: "显示输入的节点",
        },
    },


    onLoad: function () {

    },
    updatePresentedMessage(mes) {
        cc.log();
        this.MesLabel.string = mes;
    },
    onClickComfrimMessage() {
        cc.log(`确认：关闭`);
        this.node.destroy();
    },

});
