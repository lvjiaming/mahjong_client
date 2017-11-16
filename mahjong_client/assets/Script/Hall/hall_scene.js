cc.Class({
    extends: cc.Component,

    properties: {
        NickNameLabel: {
            default:null,
            type: cc.Label,
        },
        PlayerId: {
            default:null,
            type: cc.Label,
        },
        RoomCard: {
            default:null,
            type: cc.Label,
        },
        avatar: {
            default:null,
            type: cc.Sprite,
        },
        changeButton: {
            default:null,
            type: cc.Node,
        },
        infoNode: {
            default:null,
            type: cc.Node,
        },
        toUpdateCardum: null,
    },

    // use this for initialization
    onLoad: function () {
        cc.dd.tipMgr.init(this.node);
        cc.dd.appUtil.setScreenFit(this.node);
        cc.dd.roomEvent.addObserver(this);
        cc.dd.userEvent.addObserver(this);
        cc.dd.net.addObserver(this);
        this.setUserInfo();
    },
    onDestroy() {
        cc.dd.roomEvent.removeObserver(this);
        cc.dd.userEvent.removeObserver(this);
        cc.dd.net.removeObserver(this);
    },
    // 设置用户信息
    setUserInfo() {
        cc.log("设置用户信息" );
        cc.log(cc.dd.user.getUserInfo());
        this.setUserId(cc.dd.user.getUserInfo().UID);
        this.setUserNickName(cc.dd.user.getUserInfo().nickname);
        if(!cc.dd.user.getUserInfo().roomcardnum || cc.dd.user.getUserInfo().wereInGameSence) {
            this.toUpdateCardum = true;
            cc.dd.user.getUserInfo().wereInGameSence = false;
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REP,cc.dd.user.getUserInfo().UID);
        }else {
            this.setFangKaNum(cc.dd.user.getUserInfo().roomcardnum);
        }
        this.setAvatarSpriteFrame(cc.dd.user.getUserInfo().wx_portrait);
        this.setBtnChangeState(parseInt(cc.dd.user.getUserInfo().isagent));
    },
    // 设置用户的id
    setUserId(id) {
        this.PlayerId.string = "ID：" + id;
    },
    // 设置昵称
    setUserNickName(nickName) {
        this.NickNameLabel.string = nickName;
    },
    // 设置房卡数目
    setFangKaNum(num) {
        if(cc.dd.user.getCardState().unlimited === true) {
            this.RoomCard.string = "房卡：无限畅打";
            let deadline = new cc.Node('deadline');
            let deadlineLabel = deadline.addComponent(cc.Label);
            deadlineLabel.fontSize = 19;
            deadlineLabel.lineHeight = 30;
            deadline.anchorX = 0;
            this.infoNode.addChild(deadline);
            let tempstr = "";
            cc.dd.user.getCardState().unlimitedshowdetail.forEach((item) => {
               tempstr = tempstr + item;
            });
            deadlineLabel.string = tempstr;
        }else {
            this.RoomCard.string = "房卡：" + num;
        }
    },
    setAvatarSpriteFrame(sfurl) {
        var target = this.avatar;
        cc.dd.setPlayerHead(sfurl,target);
    },
    // 设置转让房卡按钮是否可见
    setBtnChangeState(state) {
        if (!state || state == 0){
            this.changeButton.active = false;
        }else {
            this.changeButton.active = true;
        }
    },
    onMessageEvent(event, data) {
        switch (event) {
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_ROOM_REP: {
                cc.log("输入的房间不存在");
                cc.dd.Reload.loadPrefab("Hall/Prefab/AlertView", (prefab) => {
                    const roomNotExitMes = cc.instantiate(prefab);
                this.node.addChild(roomNotExitMes);
                });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_GAME_STATE: {
                cc.dd.Reload.loadDir("DirRes", () => {
                    cc.dd.sceneMgr.runScene(cc.dd.sceneID.GAME_SCENE);
                });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REQ: {
                if(this.toUpdateCardum) {
                    this.toUpdateCardum = false;
                    cc.dd.user.getUserInfo().roomcardnum = data.mycards;
                    this.setFangKaNum(cc.dd.user.getUserInfo().roomcardnum);
                }
                // else {
                    // cc.log("显示转让房卡的弹窗");
                    // cc.dd.Reload.loadPrefab("Hall/Prefab/ChangeFanKa", (prefab) => {
                    //     const changePup = cc.instantiate(prefab);
                    //     this.node.addChild(changePup);
                    // });
                    // cc.dd.Reload.loadPrefab("Hall/Prefab/ExchangeFangKa", (prefab) => {
                    //     const changePup = cc.instantiate(prefab);
                    //     this.node.addChild(changePup);
                    // });
                // }
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REP: {  // 查询房卡失败返回，1007
                cc.log("输入的用户UID不存在");
                cc.dd.Reload.loadPrefab("Hall/Prefab/AlertView", (prefab) => {
                    const UIDNotExitMes = cc.instantiate(prefab);
                    UIDNotExitMes.getComponent("AlterViewScript").initInfoMes(data.errmsg);
                    this.node.addChild(UIDNotExitMes);//getComponent
                });
                break;
            }
            // case cc.dd.userEvent.QUERY_RECEIVER_SCU: {
            //     cc.log("查询接收者成功");
            //     // cc.dd.Reload.loadPrefab("Hall/Prefab/ComfrimFKExchange", (prefab) => {
            //     //     const exchangeFK = cc.instantiate(prefab);
            //     //     this.node.addChild(exchangeFK);
            //     // });
            //     break;
            // }
            case cc.dd.gameCfg.EVENT.EVENT_CARDCHANGE_REQ: {
                cc.log("转让房卡成功，更新大厅房卡数");
                this.setFangKaNum(data.myroomcards);
                cc.dd.user.updateAgentInfo(data);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_QUERY_GAMERECORD_REQ: {
                cc.log("查询战绩成功");
                cc.dd.Reload.loadPrefab("Hall/Prefab/GameRecord", (prefab) => {
                    const gameRecord = cc.instantiate(prefab);
                    gameRecord.getComponent("GameRecord").initInfo(data.scoreset);
                    this.node.addChild(gameRecord);
                });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_LOGOUT_REQ: {
                cc.log("成功登出");
                cc.dd.Reload.loadDir("DirRes", () => {
                    cc.dd.sceneMgr.runScene(cc.dd.sceneID.LOGIN_SCENE);
                });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_DELEGATE_ROOM_REOCRD_REQ: {
                cc.log("成功返回房间代理记录或是成功创建代理房间");
                //{"command":5015,"rooms":[{"roomid":244342,"playrule":[1],"nowround":-1,"players":0}]}
                cc.dd.Reload.loadPrefab("Hall/Prefab/RoomDelegateRecord", (prefab) => {
                    const delegateRecord = cc.instantiate(prefab);
                delegateRecord.getComponent("RoomDelegRecord").initInfo(data.rooms);
                cc.find("UI_ROOT").addChild(delegateRecord);
                });
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },
});
