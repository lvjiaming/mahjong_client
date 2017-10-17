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
    },

    // use this for initialization
    onLoad: function () {
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
        this.setFangKaNum(cc.dd.user.getUserInfo().roomcardnum);
        // this.setAvatarSpriteFrame(cc.dd.user.getUserInfo().wx_portrait);//跨域了，先注释掉
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
        this.RoomCard.string = "房卡：" + num;
    },
    setAvatarSpriteFrame(sfurl) {
        var self = this;
        cc.loader.load("http://wx.qlogo.cn/mmopen/vi_32/OFpicnz436LIG7e2BPAoByaibwBOEwdITGJ5IzbAYsicJfM1kPjoyyEibShVicOgRCQZqzucfuEhmGYIkicEcmmsxShw/0", function(err, texture){
            if (err){
                cc.log("头像下载错误： " + err);
            }else {
                self.avatar.spriteFrame = new cc.SpriteFrame(texture);

            }
        });
    },
    onMessageEvent(event, data) {
        switch (event) {
            case cc.dd.gameCfg.EVENT.EVENT_GAME_STATE: {
                cc.dd.Reload.loadDir("DirRes", () => {
                    cc.dd.sceneMgr.runScene(cc.dd.sceneID.GAME_SCENE);
                });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_GAME_STATE: {
                cc.log("进入房间");
                cc.dd.Reload.loadDir("DirRes", () => {
                    cc.dd.sceneMgr.runScene(cc.dd.sceneID.GAME_SCENE);
            });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_ROOM_REP: {
                cc.log("房间不存在");
                cc.dd.Reload.loadPrefab("Hall/Prefab/AlertView", (prefab) => {
                    const roomNotExitMes = cc.instantiate(prefab);
                this.node.addChild(roomNotExitMes);
            });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REQ: {
                cc.log("进入转让房卡");
                cc.dd.Reload.loadPrefab("Hall/Prefab/ChangeFanKa", (prefab) => {
                    const changePup = cc.instantiate(prefab);
                    this.node.addChild(changePup);
                });
                break;
            }
            case cc.dd.userEvent.QUERY_RECEIVER_SCU: {
                cc.log("查询接收者成功");
                cc.dd.Reload.loadPrefab("Hall/Prefab/ComfrimFKExchange", (prefab) => {
                    const exchangeFK = cc.instantiate(prefab);
                    this.node.addChild(exchangeFK);
                });
                break;
            }
            case cc.dd.userEvent.EXCHANGE_FK_SCU: {
                cc.log("转让房卡成功，更新大厅房卡数");
                var currentFKNum = parseInt(cc.dd.user.getUserInfo().roomcardnum) - parseInt(cc.dd.user._userInfo.recieveCardNum);
                this.setFangKaNum(currentFKNum);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_QUERY_GAMERECORD_REQ: {
                cc.log("查询战绩成功");
                cc.dd.Reload.loadPrefab("Hall/Prefab/GameRecord", (prefab) => {
                    const gameRecord = cc.instantiate(prefab);
                    gameRecord.getComponent("GameRecord").initInfo(data.scoreSet);
                    this.node.addChild(gameRecord);
                });
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },
    // 设置转让房卡按钮是否可见
    setBtnChangeState(state) {
        cc.log("isagent:"+state);
        if (!state || state == 0){
            this.changeButton.active = false;
            return;
        }
        cc.log("isagent:"+state);
        // if (this.changeButton) {
            this.changeButton.active = true;
        // } else {
        //     cc.log(`节点未绑定`);
        // }
    },
});
