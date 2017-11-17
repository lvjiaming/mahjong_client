
cc.Class({
    extends: cc.Component,

    properties: {
        topNode: {
            default: null,
            type: cc.Node,
            tooltip: "顶部栏节点",
        },
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
        recieverCardDiscript: {
            default: null,
            type: cc.Label,
            tooltip: "转让卡描述",
        },
        recieverTip: {
            default: null,
            type: cc.Label,
            tooltip: "转让卡tips",
        },
        _selectCardType: null,
    },

    // use this for initialization
    onLoad: function () {
        cc.dd.userEvent.addObserver(this);
        cc.dd.net.addObserver(this);
        if(cc.sys.isMobile) {
            this.changeEditBox.InputMode = cc.EditBox.InputMode.PHONE_NUMBER;
        }
        this.setupInit(cc.dd.hall_config.EXC_CARD_TYPE.EXC_DAYKA);
    },
    onDestroy() {
        cc.dd.userEvent.removeObserver(this);
        cc.dd.net.removeObserver(this);
    },
    setupInit(type) {
        this._selectCardType = type;
        this.node.getChildByName("bottomHalf").active = false;
        switch (type) {
            case cc.dd.hall_config.EXC_CARD_TYPE.EXC_DAYKA: {
                this.numLabel.string = cc.dd.user.getAgentInfo().mydaycards + "张" + cc.dd.hall_config.EXC_BAOSHIKA_TABNUM.BAOSHIKA_DAY + "可以转让";
                break;
            }
            case cc.dd.hall_config.EXC_CARD_TYPE.EXC_WEEKKA: {
                this.numLabel.string = cc.dd.user.getAgentInfo().myweekcards + "张" + cc.dd.hall_config.EXC_BAOSHIKA_TABNUM.BAOSHIKA_WEEK + "可以转让";
                break;
            }
            case cc.dd.hall_config.EXC_CARD_TYPE.EXC_MOUTHKA: {
                this.numLabel.string = cc.dd.user.getAgentInfo().mymonthcards + "张" + cc.dd.hall_config.EXC_BAOSHIKA_TABNUM.BAOSHIKA_MOUTH + "可以转让";
                break;
            }
            default: {
                cc.log(`unkown init: ${type}`);
            }
        }
    },
    // 查询按钮点击响应方法
    onClickQuery() {
        cc.log("查询接收者信息");
        if (this.changeEditBox) {
            if (!this.changeEditBox.string) {
                cc.log(`请输入转让的人！！`);
            } else {
                cc.log(`转让人：${this.changeEditBox.string}, 转让数量：${this._preNum}`);// 测试数据 20405
                cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REP,this.changeEditBox.string);
            }
        }
    },
    // 顶部三个tab的点击响应方法
    onClickToChooseCardType(event,customData) {
        this.setupInit(customData);
        switch (customData) {
            case cc.dd.hall_config.EXC_CARD_TYPE.EXC_DAYKA: {
                this.topNode.getChildByName("tab1").active = true;
                this.topNode.getChildByName("tab2").active = false;
                this.topNode.getChildByName("tab3").active = false;
                break;
            }
            case cc.dd.hall_config.EXC_CARD_TYPE.EXC_WEEKKA: {
                this.topNode.getChildByName("tab1").active = false;
                this.topNode.getChildByName("tab2").active = true;
                this.topNode.getChildByName("tab3").active = false;
                break;
            }
            case cc.dd.hall_config.EXC_CARD_TYPE.EXC_MOUTHKA: {
                this.topNode.getChildByName("tab1").active = false;
                this.topNode.getChildByName("tab2").active = false;
                this.topNode.getChildByName("tab3").active = true;
                break;
            }
            default: {
                cc.log(`unkown init: ${type}`);
            }
        }
    },
    // 输入框确认的事件，确认框,每次编辑改变内容将会调用
    onEditBoxFixClick(event) {
        cc.log(`转让人的id: ${this.changeEditBox.string}`);
    },
    // 确认的事件，确认按钮
    onFixClick() {
        cc.dd.Reload.loadPrefab("Hall/Prefab/ComfrimFKExchange", (prefab) => {
            const exchangeFK = cc.instantiate(prefab);
            exchangeFK.getComponent("ConfrimChangeFk").setUserInfo(cc.dd.user.getReciverInfo());
            this.node.parent.parent.addChild(exchangeFK);
        });
    },
    onMessageEvent(event, data) {
        switch(event) {
            case cc.dd.gameCfg.EVENT.EVENT_CARDCHANGE_REQ: {
                this.node.parent.parent.parent.destroy();
                break;
            }
            case cc.dd.userEvent.QUERY_RECEIVER_SCU: {
                this.randerBottomHalf(data);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REQ: {
                this.randerBottomHalf(data);
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },
    snipLabelStringForDestriptionLabel(data) {
        var temp = " ";
        if (data){
            if(data.length>0){
                data.forEach((item,index) => {
                    if(index === 0) {
                        temp = item[0] + " " + item[1];
                    }else {
                        temp = temp + "\n" + item[0] + " " + item[1];
                    }
                });
                this.recieverCardDiscript.string = temp;
            }
        }else {
            return;
        }
    },
    randerBottomHalf(data) {
        if (!this.changeEditBox.string || (this.changeEditBox.string != data.uid4query)) {
            return;
        }
        switch (this._selectCardType) {
            case cc.dd.hall_config.EXC_CARD_TYPE.EXC_DAYKA: {
                this.snipLabelStringForDestriptionLabel(data.daycard);
                break;
            }
            case cc.dd.hall_config.EXC_CARD_TYPE.EXC_WEEKKA: {
                this.snipLabelStringForDestriptionLabel(data.weekcard);
                break;
            }
            case cc.dd.hall_config.EXC_CARD_TYPE.EXC_MOUTHKA: {
                this.snipLabelStringForDestriptionLabel(data.monthcard);
                break;
            }
            default: {
                cc.log(`unkown init: ${type}`);
            }
        }
        this.node.getChildByName("bottomHalf").active = true;
        this.recieverName.string = data.nickname;
        this.recieverTip.string = data.tips;
        cc.dd.setPlayerHead(data.wx_portrait,this.recieverAvatar);
        cc.dd.user._receiverInfo.recieveCardtype = this._selectCardType;
        cc.dd.user._receiverInfo.recieveCardNum = 1;
    }
});
