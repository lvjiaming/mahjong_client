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
     *  初始化战绩信息
     * @param data
     */
    initInfo(data) {
        // cc.dd.Reload.loadPrefab("Hall/Prefab/GameRecordInfo", (prefab) => {
        //     data.forEach((item) => {
        //         const info = cc.instantiate(prefab);
        //         info.getComponent("GameRecordInfo").initInfo(item);
        //         if (this.ContentNode) {
        //             this.ContentNode.addChild(info);
        //         }
        //     });
        // });
        cc.dd.Reload.loadPrefab("Hall/Prefab/GameRecordInfoBlue", (prefab) => {
            data.forEach((item) => {
            const info = cc.instantiate(prefab);
        info.getComponent("GameRecordInfo").initInfo(item);
        if (this.ContentNode) {
            this.ContentNode.addChild(info);
        }
    });
    });
    },
    onCloseClick() {
        this.node.destroy();
    },
});
