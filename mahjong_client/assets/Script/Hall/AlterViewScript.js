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
    // 改mes信息
    initInfoMes(data) {
        this.MesLabel.string = data;
    },
    // 确认按钮
    onClickComfrimMessage() {
        cc.log(`确认：关闭`);
        this.node.destroy();
    },

});
