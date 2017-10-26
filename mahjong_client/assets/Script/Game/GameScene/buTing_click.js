cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        // cc.dd.cardMgr.setIsCanOutCard(false);
    },
    onBuTingClick() {
        // cc.dd.cardMgr.setIsCanOutCard(true);
        cc.dd.cardMgr.setTingList(null);
        const cardNode = this.node.parent.getComponent("mj_gameScene").playerArr[0].getChildByName("HandCardLayer").getChildByName("HandCardLay");
        cardNode.children.forEach((item) => {
            item.getChildByName("TingSign").active = false;
        });
        this.node.destroy();
    },
});
