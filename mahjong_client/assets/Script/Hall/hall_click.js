cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },
    // 创建房间
    onCreClick() {
        cc.log(`创建房间`);
        cc.dd.Reload.loadPrefab("Hall/Prefab/CrePup", (prefab) => {
            const crePup = cc.instantiate(prefab);
            this.node.addChild(crePup);
        });
    },
    // 进入房间
    onEnterRoomClick() {
        cc.log(`进入房间`);
        cc.dd.Reload.loadPrefab("Hall/Prefab/EnterPup", (prefab) => {
            const enterPup = cc.instantiate(prefab);
            this.node.addChild(enterPup);
        });
    },
    // 转让房卡
    onChangeClick() {
        cc.log(`转让房卡`);
    },
    // 分享
    onShareClick() {
        cc.log(`分享`);
    },
    // 帮助
    onHelpClick() {
        cc.log(`帮助`);
    },
    // 设置
    onSettingClick() {
        cc.log(`设置`);
        cc.dd.Reload.loadPrefab("Hall/Prefab/Setting ", (prefab) => {
            const setting = cc.instantiate(prefab);
            this.node.addChild(setting);
        });
    },
    // 战绩
    onRecordClick() {
        cc.log(`战绩`);
        cc.dd.Reload.loadPrefab("Hall/Prefab/GameRecord", (prefab) => {
            const gameRecord = cc.instantiate(prefab);
            gameRecord.getComponent("GameRecord").initInfo([1, 2, 3]);
            this.node.addChild(gameRecord);
        });
    },
});
