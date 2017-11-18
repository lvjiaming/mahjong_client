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
            tooltip: "转让id输入框",
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
        recieverAvatar: {
            default: null,
            type: cc.Sprite,
            tooltip: "玩家头像",
        },
        recieverName: {
            default: null,
            type: cc.Label,
            tooltip: "玩家昵称",
        },
        querybtn: {
            default: null,
            type: cc.Button,
            tooltip: "查询按钮",
        },
        _preNum: 1,
    },

    // use this for initialization
    onLoad: function () {
        cc.dd.userEvent.addObserver(this);
        cc.dd.net.addObserver(this);
        this.totalCardLabel.string = cc.dd.user.getUserInfo().roomcardnum + "张房卡可以转让";
        if(cc.dd.user.getUserInfo().roomcardnum === 0){
            this.renderQueryBtn();
        }
        if(cc.sys.isMobile) {
            this.changeEditBox.InputMode = cc.EditBox.InputMode.PHONE_NUMBER;
            this.NumChangeEditBox.InputMode = cc.EditBox.InputMode.PHONE_NUMBER;
        }
    },
    onDestroy() {
        cc.dd.userEvent.removeObserver(this);
        cc.dd.net.removeObserver(this);
    },
    // 查询按钮的状态
    renderQueryBtn() {
        this.querybtn.interactable = false;
        this.querybtn.node.getChildByName("Label").color = cc.Color.GRAY;
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

    // 确认的事件，确认按钮
    onFixClick() {
        cc.dd.user._receiverInfo.recieveCardNum = this._preNum;
        cc.dd.Reload.loadPrefab("Hall/Prefab/ComfrimFKExchange", (prefab) => {
            const exchangeFK = cc.instantiate(prefab);
            exchangeFK.getComponent("ConfrimChangeFk").setUserInfo(cc.dd.user.getReciverInfo());
            this.node.parent.parent.addChild(exchangeFK);
        });
    },
    onMessageEvent(event, data) {
        if(this.node.active === false) {
            cc.log("非次卡");
            return;
        }
        switch(event) {
            case cc.dd.gameCfg.EVENT.EVENT_CARDCHANGE_REQ: {
                // this.node.parent.parent.parent.destroy();
                cc.dd.Reload.loadPrefab("Hall/Prefab/AlertView", (prefab) => {
                    const UIDNotExitMes = cc.instantiate(prefab);
                    const tempstr = "成功转让"+ this._preNum +"张次卡\n剩余次卡" + data.myroomcards + "张\n" + "剩余天卡" + data.agent.mydaycards + "张\n" + "剩余小王卡" + data.agent.myweekcards + "张\n" + "剩余大王卡" + data.agent.mymonthcards + "张";
                    UIDNotExitMes.getComponent("AlterViewScript").initInfoMes(tempstr);
                    this.node.parent.parent.addChild(UIDNotExitMes);
                });
                break;
            }
            case cc.dd.userEvent.QUERY_RECEIVER_SCU: {
                this.node.getChildByName("bottomHalf").active = true;
                this.recieverName.string = data.nickname;
                cc.dd.setPlayerHead(data.wx_portrait,this.recieverAvatar);
                cc.dd.user._receiverInfo.recieveCardtype = cc.dd.hall_config.EXC_CARD_TYPE.EXC_CHIKA;
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CARDCHANGE_REP: { // 1008 转让失败
                cc.dd.Reload.loadPrefab("Hall/Prefab/AlertView", (prefab) => {
                    const UIDNotExitMes = cc.instantiate(prefab);
                    UIDNotExitMes.getComponent("AlterViewScript").initInfoMes("转让失败。"+data.errmsg);
                    this.node.parent.parent.addChild(UIDNotExitMes);
                });
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },
    // 输入框确认的事件，确认框,每次编辑改变内容将会调用
    onEditBoxFixClick(event) {
        cc.log(`转让人的id: ${this.changeEditBox.string}`);
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
    onClickQuery() {
      cc.log("查询接收者信息");
        if (this.changeEditBox) {
            if (!this.changeEditBox.string) {
                cc.log(`请输入转让的人！！`);
            } else {
                cc.log(`转让人：${this.changeEditBox.string}, 转让数量：${this._preNum}`);
                //20405
                cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REP,this.changeEditBox.string);
            }
        }
    },
});
