cc.Class({
    extends: cc.Component,

    properties: {
        CardLayer: {
            default: null,
            type: cc.Node,
            tooltip: "麻将的容器",
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    // 初始化麻将
    initCard(data) {
        cc.dd.Reload.loadPrefab("Game/Prefab/ChiSelectItem", (prefab) => {
            data.forEach((chiData) => {
                const chi = cc.instantiate(prefab);
                chi.data = chiData;
                chi.children.forEach((card, index) => {
                    card.getComponent("CardSpr").initCard(chiData[index]);
                });
                this.CardLayer.addChild(chi);
            });
        });
    },
    // 关闭按钮
    onCloseClick() {
        this.node.destroy();
    },
});
