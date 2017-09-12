cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },
    // 返回
    onReturnClick() {
        cc.log(`返回`);
    },
    // 扩展tool
    onKuoZhanClick() {
        cc.log(`扩展`);
        cc.dd.Reload.loadPrefab("Game/Prefab/KuoZhanTool", (prefan) => {
            const kzTool = cc.instantiate(prefan);
            this.node.addChild(kzTool);
        });
    },
    // 语音
    onSoundClick() {
        cc.log(`语音`);
    },
});
