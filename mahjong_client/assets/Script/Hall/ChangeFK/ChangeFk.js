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
        NumChangeEditBox: {
            default: null,
            type: cc.EditBox,
            tooltip: "房卡数输入框",
        },
        totalCardLabel: {
            default: null,
            type: cc.Label,
            tooltip: "有张房卡可以转让",
        },
        // recieverAvatar: {
        //     default: null,
        //     type: cc.Sprite,
        //     tooltip: "玩家头像",
        // },
        _preNum: 1,
    },

    // use this for initialization
    onLoad: function () {
        cc.dd.userEvent.addObserver(this);
        cc.dd.net.addObserver(this);
        this.totalCardLabel.string = cc.dd.user.getUserInfo().roomcardnum + "张房卡可以转让";
        if(cc.sys.isMobile) {
            this.changeEditBox.InputMode = cc.EditBox.InputMode.PHONE_NUMBER;
            this.NumChangeEditBox.InputMode = cc.EditBox.InputMode.PHONE_NUMBER;
        }
    },
    onDestroy() {
        cc.dd.userEvent.removeObserver(this);
        cc.dd.net.removeObserver(this);
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
                cc.dd.user._userInfo.recieveCardNum = this._preNum;
                //20405
                //重写user事件
                cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REP,this.changeEditBox.string);
            }
        }
        // this.node.destroy();
    },
    // 输入框确认的事件，确认框,每次编辑改变内容将会调用
    onEditBoxFixClick(event) {
        cc.log(`转让人的id: ${this.changeEditBox.string}`);
    },
    onMessageEvent(event, data) {
        switch(event) {
            case cc.dd.gameCfg.EVENT.EVENT_CARDCHANGE_REQ: {
                this.node.destroy();
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },
    onNumEditBoxStartEdting() {
        cc.log("开始编辑");
        // this.NumChangeEditBox.string = this._preNum.toString();
        this.numLabel.node.active = false;
    },
    onNumEditBoxEdtingChanging() {
        cc.log("编辑中途");
        this._preNum = parseInt(this.NumChangeEditBox.string);
    },
    onNumEditBoxEndEdting() {
        cc.log("结束编辑");
        this.numLabel.node.active = true;
        this._preNum = parseInt(this.NumChangeEditBox.string);
        this.numLabel.string = this._preNum;
        this.NumChangeEditBox.string = "";
    },
});
