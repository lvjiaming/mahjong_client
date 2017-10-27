cc.Class({
    extends: cc.dd.player_baseClass,

    properties: {
        operateBtnNode: {
            default: null,
            type: cc.Node,
            tooltip: "操作的菜单",
        },
    },

    // use this for initialization
    onLoad: function () {
        this.setLocalSeat(1)
    },

    // 显示玩家操作的按钮（比如碰，杠，胡）
    showOperateBtn(data) {
        let guoBtn = false;
        if (data.hu) {
            this.operateBtnNode.getChildByName("BtnHu").active = true;
            guoBtn = true;
        }
        if (data.peng) {
            this.operateBtnNode.getChildByName("BtnPeng").active = true;
            guoBtn = true;
        }
        if (data.gang) {
            this.operateBtnNode.getChildByName("BtnGang").active = true;
            guoBtn = true;
        }
        if (data.chi) {
            this.operateBtnNode.getChildByName("BtnChi").active = true;
            guoBtn = true;
            cc.dd.cardMgr.setChiList(data.chilist);
        }
        if (guoBtn) {
            if (data.customData) {
                this.operateBtnNode.getChildByName("BtnGuo").customData = data.customData;
                cc.dd.cardMgr.setIsCanOutCard(false);
            }
            this.operateBtnNode.getChildByName("BtnGuo").active = true;
        }
        return guoBtn;
    },
    // 隐藏操作按钮
    hideOperateBtn() {
        if (this.operateBtnNode) {
            const btnList = this.operateBtnNode.children;
            btnList.forEach((item) => {
                item.active = false;
            });
        }
    },
});
