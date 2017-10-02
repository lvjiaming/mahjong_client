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
