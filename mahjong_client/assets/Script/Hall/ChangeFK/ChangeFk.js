cc.Class({
    extends: cc.Component,

    properties: {
        numLabel: {
            default: null,
            type: cc.Label,
            tooltip: "房卡的数量",
        },
        changeEditBox: {
            default: null,
            type: cc.EditBox,
            tooltip: "输入框",
        },
        totalCardLabel: {
            default: null,
            type: cc.Label,
            tooltip: "有张房卡可以转让",
        },
        recieverAvatar: {
            default: null,
            type: cc.Sprite,
            tooltip: "玩家头像",
        },
        _preNum: 1,
    },

    // use this for initialization
    onLoad: function () {
        this.totalCardLabel.string = cc.dd.user.getUserInfo().roomcardnum + "张房卡可以转让";
    },
    // 关闭的事件，x按钮
    onCloseClick() {
        this.node.destroy();
    },
    // 添加或减少数量的事件
    onAddOrDelClick(event, custom) {
        if (1 === parseInt(custom)) {
            this._preNum ++;
        } else {
            this._preNum --;
        }
        if (this._preNum <= 1) {
            this._preNum = 1;
        }
        if (this.numLabel) {
            this.numLabel.string = this._preNum;
        }
        cc.log(`当前的房卡：${this._preNum}`);
    },
    // 返回的事件,返回按钮事件
    onReturnClick() {
        this.node.destroy();
    },
    // 确认的事件，确认按钮
    onFixClick() {
        if (this.changeEditBox) {
            if (!this.changeEditBox.string) {
                cc.log(`请输入转让的人！！`);
            } else {
                cc.log(`转让人：${this.changeEditBox.string}, 转让数量：${this._preNum}`);
                cc.dd.Reload.loadPrefab("Hall/Prefab/ComfrimFKExchange", (prefab) => {
                    const exchangeFK = cc.instantiate(prefab);
                    this.node.addChild(exchangeFK);
                });
            }
        }
        // this.node.destroy();
    },
    // 输入框确认的事件，确认框,每次编辑改变内容将会调用
    onEditBoxFixClick(event) {
        cc.log(`转让人的id: ${this.changeEditBox.string}`);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
