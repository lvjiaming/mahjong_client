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
    // 扩展tool,isagent为1的时候才显示转让房卡
    onKuoZhanClick() {
        cc.log(`扩展，${cc.dd.user._isAgent}`);
        if (!cc.dd.user._isAgent || (cc.dd.user._isAgent == 0)){
            cc.dd.Reload.loadPrefab("Game/Prefab/NoKFKZTool", (prefan) => {
                const kzTool = cc.instantiate(prefan);
            this.node.addChild(kzTool);
            });
        }else {
            cc.dd.Reload.loadPrefab("Game/Prefab/KuoZhanTool", (prefan) => {
                const kzTool = cc.instantiate(prefan);
            this.node.addChild(kzTool);
            });
        }
    },
    // 语音
    onSoundClick() {
        cc.log(`语音`);
    },
    // 碰
    onPengClick() {
        cc.log(`发送碰牌请求`);
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_PENGCARD_REP);
    },
    // 杠
    onGangClick() {
        cc.log(`发送杠牌请求`);
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_GANGCARD_REP);
    },
    onHuClick() {
        cc.log(`发送胡牌请求`);
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_HUCARD_REP);
    },
    // 过
    onGuoClick() {
        cc.log(`过牌`);
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_GUOCARD_REP);
    },
    // 吃
    onChiClick() {
        cc.log(`发送吃牌的请求`);
        const chiList = cc.dd.cardMgr.getChiList();
        if (chiList) {
            cc.dd.Reload.loadPrefab("Game/Prefab/ChiSelect", (prefab) => {
                const chiLayer = cc.instantiate(prefab);
                chiLayer.getComponent("ChiSelect").initCard(chiList);
                this.node.addChild(chiLayer);
            });
        }
    },
});
