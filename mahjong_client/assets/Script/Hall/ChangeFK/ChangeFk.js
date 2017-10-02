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
        _preNum: 1,
    },

    // use this for initialization
    onLoad: function () {

    },
    // 关闭的事件
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
    // 返回的事件
    onReturnClick() {
        this.node.destroy();
    },
    // 确认的事件
    onFixClick() {
        if (this.changeEditBox) {
            if (!this.changeEditBox.string) {
                cc.log(`请输入转让的人！！`);
            } else {
                cc.log(`转让人：${this.changeEditBox.string}, 转让数量：${this._preNum}`);
            }
        }
        this.node.destroy();
    },
    // 输入框确认的事件
    onEditBoxFixClick(event) {
        cc.log(`转让人的id: ${this.changeEditBox.string}`);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
