cc.Class({
    extends: cc.Component,

    properties: {
        LeftContent: {
            default: null,
            type: cc.Node,
            tooltip: "左边的容器",
        },
        RightContent: {
            default: null,
            type: cc.Node,
            tooltip: "右边的容器",
        },
        HuanJuNode: {
            default: null,
            type: cc.Node,
            tooltip: "黄局",
        },
        JuNode: {
            default: null,
            type: cc.Label,
            tooltip: "局数信息",
        },
        NextBtn: {
            default: null,
            type: cc.Node,
            tooltip: "下一句的按钮",
        },
        ReturnBtn: {
            default: null,
            type: cc.Node,
            tooltip: "返回的按钮",
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     *  初始化内容
     */
    initNote(data) {
        // 更新局数信息
        if (this.JuNode) {
            this.JuNode.string = `第${data.nowround}/${data.rounds}局`
            if (data.nowround === data.rounds) {
                this.showBtn(true);
            } else {
                this.showBtn(false);
            }
        }
        // 是否黄局
        if (this.HuanJuNode) {

        }
        // 渲染左边内容
        cc.dd.Reload.loadPrefab("Game/Prefab/LeftNote", (prefab) => {
            data.userlist.forEach((item) => {
                const left = cc.instantiate(prefab);
                left.getComponent("GO_LeftNote").initNote(item);
                this.LeftContent.addChild(left);
            });
        });
        // 渲染右边的信息
        cc.dd.Reload.loadPrefab("Game/Prefab/RightNote", (prefab) => {
            data.userlist.forEach((item) => {
                const right = cc.instantiate(prefab);
                right.getComponent("GO_RightNote").initNote(item, {huType: data.hutype, dianpaouid: data.dianpaouid});
                this.RightContent.addChild(right);
            });
        });
    },
    // 显示按钮
    showBtn(state) {
        if (state) {
            this.ReturnBtn.active = true;
        } else {
            this.NextBtn.active = true;
        }
    },
    // 下一句监听事件
    nextBtnClick() {
        this.node.destroy();
        cc.dd.roomEvent.setIsCache(true);
        cc.dd.roomEvent.notifyCacheList();
    },
    // 返回监听的事件
    returnBtnClick() {
        cc.log(`返回`);
    },
});
