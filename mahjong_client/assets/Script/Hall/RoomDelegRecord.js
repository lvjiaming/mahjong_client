cc.Class({
    extends: cc.Component,

    properties: {
        ContentNode: {
            default: null,
            type: cc.Node,
            tooltip: "容器",
        },
    },

    // use this for initialization
    onLoad: function () {
    },
    /**
     *  初始化代理房间记录
     * @param data
     */
    initInfo(data) {
        cc.dd.Reload.loadPrefab("Hall/Prefab/DelegRoomRecordInfo", (prefab) => {
            data.forEach((item) => {
            const info = cc.instantiate(prefab);
            info.getComponent("RoomDelegRecordInfo").initInfo(item);
            if (this.ContentNode) {
                this.ContentNode.addChild(info);
            }
            });
        });
    },
    onCloseClick() {
        this.node.destroy();
    },
    onToCreDelegateRoomClick() {
        cc.log("新建代理房间");
        cc.dd.Reload.loadPrefab("Hall/Prefab/CrePup", (prefab) => {
            const cre = cc.instantiate(prefab);
            cre.getComponent("hall_creRoom").initDelgatedRoomCreSetting();
        cc.find("UI_ROOT").addChild(cre);
        });
        this.onCloseClick();
    },
});
