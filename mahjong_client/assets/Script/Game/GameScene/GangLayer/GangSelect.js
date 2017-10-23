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
        cc.dd.Reload.loadPrefab("Game/Prefab/GangSelectItem", (prefab) => {
            data.forEach((item) => {
                const gang = cc.instantiate(prefab);
                gang.data = item;
                const card = gang.getChildByName("Card");
                card.getComponent("CardSpr").initCard(item);
                this.CardLayer.addChild(gang);
            });
        });
    },
    // 关闭按钮
    onCloseClick() {
        this.node.destroy();
    },
});
