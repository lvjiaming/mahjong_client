
const END_POS = {
    x: 573,
    y: -45,
};
const MOVE_TIME = 0.3;

cc.Class({
    extends: cc.Component,

    properties: {
        NoteNode: {
            default: null,
            type: cc.Node,
            tooltip: "具体的内容",
        },
    },

    // use this for initialization
    onLoad: function () {
        if (this.NoteNode) {
            const moveAni = cc.moveTo(MOVE_TIME, cc.p(END_POS.x, END_POS.y));
            this.NoteNode.runAction(moveAni);
        }
    },
    // 关闭
    onCloseClick() {
        this.node.destroy();
    },
    // 设置
    onSettingClick() {
        cc.log(`设置`);
        cc.dd.Reload.loadPrefab("Hall/Prefab/Setting ", (prefab) => {
            const setting = cc.instantiate(prefab);
            cc.find("UI_ROOT").addChild(setting);
        });
    },
    // 玩法
    onWanFaClick() {
        cc.log(`玩法`);
    },
    // 解散房间
    onJieSanRoomClick() {
        cc.log(`解散房间`);
    },
    // 转让房卡
    onChangeClick() {
        cc.log(`转让房卡`);
        cc.dd.Reload.loadPrefab("Hall/Prefab/ChangeFanKa", (prefab) => {
            const changePup = cc.instantiate(prefab);
            cc.find("UI_ROOT").addChild(changePup);
        });
    },
});
