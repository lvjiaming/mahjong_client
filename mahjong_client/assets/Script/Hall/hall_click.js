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
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REP,cc.dd.user.getUserInfo().UID);

    },
    // 分享
    onShareClick() {
        cc.log(`分享`);
        cc.dd.Reload.loadPrefab("Hall/Prefab/Shares", (prefab) => {
            const sharing = cc.instantiate(prefab);
            this.node.addChild(sharing);
        });
    },
    // 帮助
    onHelpClick() {
        cc.log(`帮助`);
        cc.dd.Reload.loadPrefab("Hall/Prefab/Helps", (prefab) => {
            const helping = cc.instantiate(prefab);
            this.node.addChild(helping);
        });
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
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_QUERY_GAMERECORD_REP);
    },
});
