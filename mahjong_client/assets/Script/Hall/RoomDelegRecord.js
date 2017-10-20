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
        this.initInfo();
    },
    /**
     *  初始化代理房间记录
     * @param data
     */
    initInfo(data) {
        cc.dd.Reload.loadPrefab("Hall/Prefab/DelegRoomRecordInfo", (prefab) => {
            [1,2,2].forEach((item) => {
            const info = cc.instantiate(prefab);
            // info.getComponent("DelegRoomRecordInfo").initInfo(item);
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
        this.onCloseClick();
    },
});
