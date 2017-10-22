cc.Class({
    extends: cc.Component,

    properties: {
        MesLabel: {
            default: null,
            type: cc.Label,
            tooltip: "显示输入的节点",
        },
        DismissRoomSuc: null,
    },
    onLoad: function () {
    },
    // 改mes信息
    initInfoMes(data) {
        this.MesLabel.string = data;
        if(data == "解散房间成功") {
            this.DismissRoomSuc = true;
        }
    },
    // 确认按钮
    onClickComfrimMessage() {
        cc.log(`alterview-确认：关闭`);
        if(this.DismissRoomSuc) {
            cc.dd.soundMgr.stopAllSound();
            cc.dd.Reload.loadDir("DirRes", () => {
                cc.dd.sceneMgr.runScene(cc.dd.sceneID.HALL_SCENE);
            });
        }
        this.node.destroy();
    },

});
