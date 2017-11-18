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
        }else if(data.indexOf("成功转让") != -1) {
            this.exchangeFKSuc = true;
        }else if(data.indexOf("转让失败") != -1) {
            this.exchangeFKFail = true;
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
            this.node.destroy();
        }else if(this.exchangeFKSuc) {
            this.node.parent.parent.destroy();
        }else if(this.exchangeFKFail) {
            this.node.parent.parent.destroy();
        }else {
            this.node.destroy();
        }

    },

});
