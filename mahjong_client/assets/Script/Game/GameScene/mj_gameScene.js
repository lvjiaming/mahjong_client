/*
    处理游戏里的逻辑
 */

const cardArr = [
    {id: 1},
    {id: 10},
    {id: 13},
    {id: 14},
    {id: 10},
    {id: 11},
    {id: 20},
    {id: 25},
    {id: 27},
    {id: 33},
    {id: 21},
    {id: 11},
    {id: 12},
   // {suit: 2, num: 6},
];
const HU_TYPE_NAME = [
    null,
    "zimo",
    "pinghu",
    "sihui",
    "duibao",
    "loubao",
    "gangshanghua"
];
const PLAY_OPERA_NAME = [
    null,
    "可断门",
    "闭门胡",
    "会牌",
    "搂宝",
    "夹胡",
    "点炮包三家",
    "清一色",
];
const PLAY_OPERA_NAME_ORAL = [
    null,
    "可断门",
    "可闭门",
    "带会儿",
    "搂宝",
    "夹胡",
    "点炮赔三家",
    "清一色",
];

cc.Class({
    extends: cc.Component,

    properties: {
        playerArr: [],  // 保存玩家的数组
        PlayerNode: {
            default: null,
            type: cc.Node,
            tooltip: "玩家的根节点",
        },
        TimerNode: {
            default: null,
            type: cc.Node,
            tooltip: "转盘",
        },
        BaoCard: {
            default: null,
            type: cc.Node,
            tooltip: "宝牌",
        },
        QiangTouCard: {
            default: null,
            type: cc.Node,
            tooltip: "墙头牌",
        },
        TopLabel: {
            default: null,
            type: cc.Label,
            tooltip: "玩法和番数",
        },
        JushuLabel: {
            default: null,
            type: cc.Label,
            tooltip: "局数",
        },
        RoomIDLabel: {
            default: null,
            type: cc.Label,
            tooltip: "房间号",
        },
        BatteryImage: {
            default: null,
            type: cc.ProgressBar,
            tooltip: "电池图标",
        },
        ChargingSignImage: {
            default: null,
            type: cc.Node,
            tooltip: "电池充电图标",
        },
        TimeLabel: {
            default: null,
            type: cc.Label,
            tooltip: "当前时间",
        },
        HuAniNode: {
            default: null,
            type: cc.Node,
            tooltip: "胡的动画节点",
        },
        CopyRoomIDBtn: {
            default: null,
            type: cc.Node,
            tooltip: "复制房间号",
        },
        InviteFriendBtn: {
            default: null,
            type: cc.Node,
            tooltip: "邀请好友",
        },
        callback: null,
    },

    // use this for initialization
    onLoad: function () {
        // 屏幕适配
        cc.dd.pollKey = false;
        cc.dd.appUtil.setScreenFit(this.node);
        cc.dd.soundMgr.playMusic("resources/Game/Sound/common/bg.mp3", true);

        this.initPlayerArr();
        // 测试手牌
       // this.PlayerNode.getChildByName("Bottom").getComponent("PlayerSelf").createHandCard(cardArr);

        cc.dd.roomEvent.notifyMsg();
        cc.dd.net.setCallBack(this);
    },
    onDestroy() {
        this.unschedule(this.callback);
    },

    // 监听重连后的回调
    reconnected() {
        cc.log(`重连上了。。。`);
        cc.dd.roomEvent.cleanCacheList();
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REP, "6SDF4ASD4GFAS4FG5ASD5F5Dsdf");
    },

    // 初始化玩家的列表
    initPlayerArr() {
        cc.log("初始化玩家的列表init");
        this.playerArr.push(this.PlayerNode.getChildByName("Bottom"));
        this.PlayerNode.getChildByName("Bottom").localSeat = 1;
        this.PlayerNode.getChildByName("Bottom").mesArr = [];
        // this.PlayerNode.getChildByName("Bottom").outCardArr = [];
        this.PlayerNode.getChildByName("Bottom").outPengArr = [];
        // this.PlayerNode.getChildByName("Bottom").outChiArr = [];
        this.playerArr.push(this.PlayerNode.getChildByName("Right"));
        this.PlayerNode.getChildByName("Right").localSeat = 2;
        this.PlayerNode.getChildByName("Right").mesArr = [];
        // this.PlayerNode.getChildByName("Right").outCardArr = [];
        this.PlayerNode.getChildByName("Right").outPengArr = [];
        this.playerArr.push(this.PlayerNode.getChildByName("Top"));
        this.PlayerNode.getChildByName("Top").localSeat = 3;
        this.PlayerNode.getChildByName("Top").mesArr = [];
        // this.PlayerNode.getChildByName("Top").outCardArr = [];
        this.PlayerNode.getChildByName("Top").outPengArr = [];
        this.playerArr.push(this.PlayerNode.getChildByName("Left"));
        this.PlayerNode.getChildByName("Left").localSeat = 4;
        this.PlayerNode.getChildByName("Left").mesArr = [];
        // this.PlayerNode.getChildByName("Left").outCardArr = [];
        this.PlayerNode.getChildByName("Left").outPengArr = [];
        cc.dd.room._playerNodeArr = this.playerArr;
    },
    // 初始化玩家
    initPlayerSeat(data) {
        this.cleanDesk();

        const userList = this.sortUserList(data.myuid);
        cc.dd.roomEvent.setIsCache(false);
        cc.dd.cardMgr.setHuiPai(data.room.guicard);
        // 相同IP地址需要显示
        if(userList.length > 1){
            let count = 0;
            let newarr = [];
            for (let i = 0; i < userList.length-1; i++) { //
                if (userList[i].ipaddress != userList[i + 1].ipaddress) {
                    newarr.push(userList.slice(count, i + 1));
                    count = i + 1;
                }
            }
            // cc.log(JSON.stringify(newarr) + "数组：" +userList);
            if(newarr.length > 0 ) {
                userList.forEach((item, index) => {
                    if(item == newarr[0][0]){
                    item.needHideIp = true;
                    }
                    if(newarr.length == 2) {
                        if(item == newarr[0][1]){
                            item.needHideIp = true;
                        }
                    }
                });
            }
        }else {
            userList[0].needHideIp = true;
        }



        userList.forEach((item, index) => {
            this.playerArr[index].active = true;
            let player_class = null;

            // 手牌节点
            const handNode = this.playerArr[index].getChildByName("HandCardLayer").getChildByName("HandCardLay");

            if (index === 0) {
                cc.log(`初始化自己的信息`);
                player_class = this.playerArr[index].getComponent("PlayerSelf");
                cc.dd.cardMgr.setIsCanOutCard(item.iscontroller);

                cc.dd.cardMgr.initHandCard(handNode, this.playerArr[index].localSeat, data.myhandcards);
            } else {
                cc.log(`初始化其他玩家信息`);
                player_class = this.playerArr[index].getComponent("PlayerOther");
                cc.dd.cardMgr.initHandCard(handNode, this.playerArr[index].localSeat, item.handcardsnum);
            }
            if (player_class) {
                player_class.initInfo(item);
            }

            // 初始化听得标志
            if (item.isting) {
                if (index == 0) {
                    cc.dd.cardMgr.setIsTing(item.isting);
                }
                this.playerArr[index].getChildByName("InfoBk").getChildByName("Ting").active = item.isting;
            }
        // 初始化庄家
        // cc.log("庄家zhi:"+data.isbanker);
            if(item.isbanker.toString() === "true") {
                this.playerArr[index].getChildByName("InfoBk").getChildByName("zhuangsign").active = true;
                // this.playerArr[index].getChildByName("InfoBk").getChildByName("offline").active = true;
            }else {
                this.playerArr[index].getChildByName("InfoBk").getChildByName("zhuangsign").active = false;
            }

            this.playerArr[index].userInfo = item;
            // 渲染出的牌
            this.playerOutCard({chupai: item.playedcards, senduid: item.UID, notDes: true});
            // 渲染碰的牌
            if (item.pengcards) {
                this.playerArr[index].outPengArr = item.pengcards;
                item.pengcards.forEach((pengcard) => {
                    this.playerPengCard({pengpai: pengcard, penguid: item.UID, notDes: true});
                });
            }
            // 暗杠的显示
            if (item.UID != data.myuid) {
                if (item.angangcards) {
                    item.angangcards.forEach((card) => {
                        this.playerGangCard({ganguid: item.UID, gangpai: -1, angang: true, notDes: true});
                    });
                }
            }
            // 渲染明杠的牌
            if (item.minggangcards) {
                item.minggangcards.forEach((gangcard) => {
                    this.playerGangCard({ganguid: item.UID, gangpai: gangcard, angang: false, notDes: true});
                });
            }
            // 渲染吃的牌
            if (item.chicards) {
                cc.log(item.chicards);
                item.chicards.forEach((chicard) => {
                    this.playerChiCard({straight: chicard, chipaiuid: item.UID, notDes: true});
                    if(Array.isArray(item.chicards[0])){
                        this.playerArr[index].outPengArr.push(chicard);
                    }else {
                        this.playerArr[index].outPengArr.push(item.chicards);
                    }
                });
            }
        });
        // 渲染暗杠的牌
        if (data.angangcards) {
            data.angangcards.forEach((gangcard) => {
                this.playerGangCard({ganguid: data.myuid, gangpai: gangcard, angang: true, notDes: true});
            });
        }
        // 初始化墙头牌
        this.initQiangTouCard(data.room.qiangtoucard);
        // 初始化顶部信息
        this.initTopInfo(data);

        this.scheduleOnce(() => {
            cc.dd.roomEvent.setIsCache(true);
            cc.dd.roomEvent.notifyCacheList();
        }, 0.5);
    },
    /**
     *  排序玩家
     * @param arr
     */
    sortUserList(selfUserId) {
        const userList = cc.dd.room.userList;
        // const selfInfo = cc.dd.user.getUserInfo();
        let idx = 0;
        const newUserList = [];
        userList.forEach((item, index) => {
            if (selfUserId === item.UID) {
                idx = index;
                // cc.dd.user.setUserInfo(item);
            }
        });
        for (let i = idx; i < userList.length; i ++) {
            newUserList.push(userList[i]);
        }
        for (let i = 0; i < idx; i ++) {
            newUserList.push(userList[i]);
        }
        return newUserList;
    },
    // 初始化顶部玩法信息
    initTopInfo(data) {
        // let str = "朝阳麻将";
        // let hasLouBao = false;
        // str = str + " " + data.room.rounds + "局";
        // if (data) {
        //     data.room.rules.forEach((item) => {
        //         if (item == cc.dd.gameCfg.PLAY_OPERA.LOU_BAO) {
        //             hasLouBao = true;
        //         }
        //         str = str + " " + PLAY_OPERA_NAME[item];
        //     });
        // }
        // 电池
        if(this.BatteryImage) {
            if(cc.sys.isMobile) {
                this.BatteryImage.progress = cc.dd.getCurrentBatteryStatus();
                this.ChargingSignImage.active = cc.dd.getCurrentBatteryChargingStatus();
            }
        }
        // 时间的定时器
        this.updateCurrentTime();
        this.callback = function () {
            this.updateCurrentTime();
        };
        this.schedule(this.callback, 60);

        // 显示与否，邀请按钮
        if(data.userlist.length < 4) {
            this.CopyRoomIDBtn.active = true;
            this.InviteFriendBtn.active = true;
        }else {
            this.CopyRoomIDBtn.active = false;
            this.InviteFriendBtn.active = false;
        }

        if(this.RoomIDLabel) {
            this.RoomIDLabel.string = "房间号：" + data.room.roomid;
            this.roomPassword = data.room.roomid;
        }
        if (this.JushuLabel) {
            if(data.room.nowround == -1) {
                this.JushuLabel.string = "0/" + data.room.rounds + " 局";
            }else{
                this.JushuLabel.string = data.room.nowround + "/" + data.room.rounds + " 局";
            }
        }
        let str = "";
        let hasLouBao = false;
        if (data) {
            cc.dd.room._roomRules = data.room.rules;
            data.room.rules.forEach((item) => {
                if(item == cc.dd.gameCfg.PLAY_OPERA.LOU_BAO) {
                    hasLouBao = true;
                }
                if(!str){
                    str = PLAY_OPERA_NAME[item];
                }else {
                    str = str + " " + PLAY_OPERA_NAME[item];
                }
            });
            str = str + "\n底番" + data.room.basicraise + "倍";
        }
        if (this.TopLabel) {
            this.TopLabel.string = str;
        }
        if (hasLouBao) {
            this.setBaoCard(true, data.baocard)
        } else {
            this.setBaoCard(false);
        }
    },
    // 初始化墙头牌
    initQiangTouCard(data) {
        if (this.QiangTouCard) {
            if (data || data == 0) {
                this.QiangTouCard.getComponent("CardSpr").initCard(data);
                this.QiangTouCard.active = true;
            } else {
                this.QiangTouCard.active = false;
            }
        }
    },
    // 设置宝牌
    setBaoCard(state, data) {
        if (this.BaoCard) {
            this.BaoCard.active = state;
            if (state) {
                const bk = this.BaoCard.getChildByName("BaoCardBk");
                const card = this.BaoCard.getChildByName("BaoCard");
                if (data || data == 0) {
                    bk.active = false;
                    card.active = true;
                    this.BaoCard.getComponent("CardSpr").initCard(data);
                } else {
                    bk.active = true;
                    card.active = false
                }
            }
        }
    },
    // 玩家出牌
    playerOutCard(data) {
        cc.dd.roomEvent.setIsCache(false);
        if (this.node.getChildByName("BuTing")) {
            this.node.getChildByName("BuTing").destroy();
        }
        if (!data.notDes) {
            cc.dd.roomEvent.setIsCache(false);
        }
        const localSeat = this.getLocalSeatByUserId(data.senduid);
        if (localSeat) {
            const outNode = this.playerArr[localSeat - 1].getChildByName("OutCardLayer");
            if (data.chupai instanceof Array) {
                // this.playerArr[localSeat-1].outCardArr = data.chupai;
                data.chupai.forEach((item) => {
                    cc.dd.cardMgr.outCard(outNode, localSeat, item, data.notDes);
                });
            } else {
                if (localSeat !== 1) {
                    if (!data.notDes) {
                        const suit = parseInt(data.chupai / 9) + 1;
                        const num = data.chupai % 9 + 1;
                        cc.dd.playEffect(1, num, suit);
                    }
                    cc.dd.cardMgr.outCard(outNode, localSeat, data.chupai);
                }
                // this.playerArr[localSeat-1].outCardArr.push(data.chupai);
            }
        } else {
            cc.error(`本地座位号未找到！！！`);
        }
        // 有碰杠胡时显示操作按钮
        if (data.myaction) {
            const self = this.playerArr[0].getComponent("PlayerSelf");
            self.showOperateBtn(data.myaction);
        }
        if (!data.notDes) {
            this.scheduleOnce(() => {
                cc.dd.roomEvent.setIsCache(true);
                cc.dd.roomEvent.notifyCacheList();
            }, 0.5);
        }
    },
    // 玩家吃牌
    playerChiCard(data) {
        const localSeat = this.getLocalSeatByUserId(data.chipaiuid);
        if (!data.notDes) {
            cc.dd.roomEvent.setIsCache(false);
            cc.dd.playEffect(1, cc.dd.soundName.V_CHI);
            cc.dd.Reload.loadPrefab("Game/Prefab/ChiAni", (prefab) => {
                const chiAni = cc.instantiate(prefab);
                this.playerArr[localSeat - 1].getChildByName("AniNode").addChild(chiAni);
            });
            // const chupaiseat = this.getLocalSeatByUserId(data.chupaiuid);
            // this.playerArr[chupaiseat - 1].outCardArr.splice(this.playerArr[chupaiseat - 1].outCardArr.length-1,1);
            this.playerArr[localSeat - 1].outPengArr.push(data.straight);
        }

        if (localSeat) {
            const pengNode = this.playerArr[localSeat - 1].getChildByName("PengGangLayer");
            cc.dd.cardMgr.pengGangCard(pengNode, localSeat, data, cc.dd.gameCfg.OPERATE_TYPE.CHI);
            if (localSeat == 1) {
                /* ---------------------------  */
                cc.dd.cardMgr.setIsCanOutCard(true);//吃牌成功以后可以出牌
                /* ---------------------------  */
                if (data.lostcards4ting) {
                    cc.dd.cardMgr.setTingList(data.lostcards4ting);
                    // let operateData = {};
                    // if (data.lostcards4ting.length > 0) {
                    //     operateData.ting = true;
                    // }
                    // this.playerArr[0].getComponent("PlayerSelf").showOperateBtn(operateData);
                }
                //this.showTingSign();
            }
        } else {
            cc.error(`本地座位号未找到！！！`);
        }
        this.scheduleOnce(() => {
            cc.dd.roomEvent.setIsCache(true);
            cc.dd.roomEvent.notifyCacheList();
        }, 0.5);
    },
    // 玩家碰牌
    playerPengCard(data) {
        const localSeat = this.getLocalSeatByUserId(data.penguid);
        if (!data.notDes) {
            cc.dd.roomEvent.setIsCache(false);
            cc.dd.playEffect(1, cc.dd.soundName.V_PENG);
            cc.dd.Reload.loadPrefab("Game/Prefab/PengAni", (prefab) => {
                const pengAni = cc.instantiate(prefab);
                this.playerArr[localSeat - 1].getChildByName("AniNode").addChild(pengAni);
            });
            // const chupaiseat = this.getLocalSeatByUserId(data.chupaiuid);
            // this.playerArr[chupaiseat - 1].outCardArr.splice(this.playerArr[chupaiseat - 1].outCardArr.length-1,1);
            this.playerArr[localSeat - 1].outPengArr.push(data.pengpai);
        }

        if (localSeat) {
            const pengNode = this.playerArr[localSeat - 1].getChildByName("PengGangLayer");
            cc.dd.cardMgr.pengGangCard(pengNode, localSeat, data, cc.dd.gameCfg.OPERATE_TYPE.PENG);
            if (localSeat == 1) {
                /* ---------------------------  */
                cc.dd.cardMgr.setIsCanOutCard(true);//碰牌成功以后可以出牌
                /* ---------------------------  */
                if (data.lostcards4ting) {
                    cc.dd.cardMgr.setTingList(data.lostcards4ting);
                    // let operateData = {};
                    // if (data.lostcards4ting.length > 0) {
                    //     operateData.ting = true;
                    // }
                    // this.playerArr[0].getComponent("PlayerSelf").showOperateBtn(operateData);
                }
                //this.showTingSign();
            }
        } else {
            cc.error(`本地座位号未找到！！！`);
        }
        if (!data.notDes) {
            this.scheduleOnce(() => {
                cc.dd.roomEvent.setIsCache(true);
                cc.dd.roomEvent.notifyCacheList();
            }, 0.5);
        }
    },
    // 玩家杠牌
    playerGangCard(data) {
        const localSeat = this.getLocalSeatByUserId(data.ganguid);
        if (!data.notDes) {
            cc.dd.roomEvent.setIsCache(false);
            cc.dd.playEffect(1, cc.dd.soundName.V_GANG);
            cc.dd.Reload.loadPrefab("Game/Prefab/GangAni", (prefab) => {
                const gangAni = cc.instantiate(prefab);
                this.playerArr[localSeat - 1].getChildByName("AniNode").addChild(gangAni);
            });
            // if(data.angang === false){
            //     const chupaiseat = this.getLocalSeatByUserId(data.chupaiuid);
            //     this.playerArr[chupaiseat - 1].outCardArr.splice(this.playerArr[chupaiseat - 1].outCardArr.length-1,1);
            // }
            this.playerArr[localSeat - 1].outPengArr.push(data.gangpai);
        }

        if (localSeat) {
            const pengNode = this.playerArr[localSeat - 1].getChildByName("PengGangLayer");
            cc.log(`进行杠牌的操作`);
            cc.dd.cardMgr.pengGangCard(pengNode, localSeat, data, cc.dd.gameCfg.OPERATE_TYPE.GANG);
        } else {
            cc.error(`本地座位号未找到！！！`);
        }
        if (data.myaction) {
            const self = this.playerArr[0].getComponent("PlayerSelf");
            self.showOperateBtn(data.myaction);
        }
        if (!data.notDes) {
            this.scheduleOnce(() => {
                cc.dd.roomEvent.setIsCache(true);
                cc.dd.roomEvent.notifyCacheList();
            }, 0.5);
        }
    },
    // 玩家胡牌
    playerHuCard(data) {
        cc.log("玩家胡牌动画效果");
        cc.dd.roomEvent.setIsCache(false);
        cc.dd.cardMgr.HideZoneOutCard();
        this.playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
        cc.dd.playEffect(1, cc.dd.soundName.V_HU);
        const localSeat = this.getLocalSeatByUserId(data.huuid);
        if (localSeat) {
            // 播放胡牌动画
            cc.dd.Reload.loadAtlas("Game/Atlas/hutype", (atlas) => {
                const str = HU_TYPE_NAME[data.hutype];
                this.huAni(localSeat, data, atlas.getSpriteFrame(str));
            });
        } else {
            cc.error(`本地座位号未找到！！！`);
        }

    },
    huAni(localSeat, data, huSpr) {
        cc.dd.roomEvent.setIsCache(false);
        const huInfo = this.playerArr[localSeat - 1].getChildByName("HuInfo");
        this.HuAniNode.active = true;
        const card = huInfo.getChildByName("HuCard");
        const huSign = huInfo.getChildByName("HuSign");
        const huTypeNode = huInfo.getChildByName("HuType");
        const scaleAni = cc.scaleTo(0.5, 1.2);
        const moveAni = cc.moveTo(0.5, huSign.getPosition());
        huTypeNode.getComponent(cc.Sprite).spriteFrame = huSpr;
        const daytime = cc.delayTime(0.5);
        const callFun1 = cc.callFunc(() => {
            cc.log("胡牌动画");
            this.HuAniNode.active = false;
            card.getComponent("CardSpr").initCard(data.hupai);
            card.active = true;
            huSign.active = true;
            huTypeNode.active = true;
            this.scheduleOnce(() => {
                cc.log(`隐藏胡牌的特效`);
                card.active = false;
                huSign.active = false;
                huTypeNode.active = false;
                cc.dd.room.huing = null;
            if(!cc.dd.room.huing) {
                cc.log(`胡牌的协议控制`);
                cc.dd.roomEvent.setIsCache(true);
                cc.dd.roomEvent.notifyCacheList();
            }
            }, 1);
        });
        this.HuAniNode.runAction(cc.sequence(scaleAni, moveAni, callFun1));
    },
    // 玩家摸牌
    playerMoCard(data, userid) {
        cc.dd.roomEvent.setIsCache(false);
        const localSeat = this.getLocalSeatByUserId(userid);
        if (localSeat) {
            const moNode = this.playerArr[localSeat - 1].getChildByName("HandCardLayer").getChildByName("MoCardLayer");
            cc.dd.cardMgr.MoCard(moNode, localSeat, data);
            if (localSeat == 1) {
                cc.dd.cardMgr.setIsCanOutCard(true);
                if (cc.dd.cardMgr.getIsTing()) {
                    /* ----------------------------  */
                   cc.dd.cardMgr.setIsCanOutCard(false);//听牌状态摸到的牌不能再手动出牌
                    /* ----------------------------  */
                }
                let operateData = {};
                if (data.ting) {
                    cc.dd.cardMgr.setTingList(data.ting);
                    if (data.ting.length > 0) {
                        operateData.ting = true;
                    }
                    cc.dd.room._isFourZeroOneTwo = true;
                }
                if (data.forcehu) {
                    cc.log(`玩家必须胡牌`);
                    cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_HUCARD_REP);
                } else {
                    if (data.hu) {
                        operateData.hu = data.hu;
                        operateData.customData = true;
                        cc.dd.room._isFourZeroOneTwo = true;
                    }
                    if (data.gangpais) {
                        operateData.gang = true;
                        operateData.customData = true;
                        cc.dd.room._isFourZeroOneTwo = true;
                    }
                    cc.dd.cardMgr.setZiMoGang(data.gangpais);
                    const hasCre = this.playerArr[0].getComponent("PlayerSelf").showOperateBtn(operateData);
                    if (!hasCre) {
                        if (cc.dd.cardMgr.getIsTing()) {
                            if (!data.hu) {
                                cc.log(`自动出牌`);
                                this.scheduleOnce(() => {
                                    moNode.children.forEach((item) => {
                                        item.destroy();
                                    });
                                    moNode.removeAllChildren();
                                    if (data.mopai === true) {
                                        cc.error(`摸牌有问题`);
                                        return;
                                    }
                                    const suit = parseInt(data.mopai / 9) + 1;
                                    const num = data.mopai % 9 + 1;
                                    cc.dd.playEffect(1, num, suit);
                                    const outCardNode = this.playerArr[0].getChildByName("OutCardLayer");
                                    cc.dd.cardMgr.outCard(outCardNode, 1, data.mopai);
                                    cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_OUTCARD_REP, {id: data.mopai, tingpai: false});
                                }, 0.5);//add by ycjia 2017-11-19
                            }
                        } else {
                            this.showTingSign();
                        }
                    } else {
                        cc.log(`有其他操作`);
                        // if (!cc.dd.cardMgr.getIsTing()) {
                        //     this.showTingSign();
                        // }
                    }
                }
            }
        } else {
            cc.error(`本地座位号未找到！！！`);
        }
        if (!data.forcehu) { // 非强制胡
            this.scheduleOnce(() => {
                cc.dd.roomEvent.setIsCache(true);
                cc.dd.roomEvent.notifyCacheList();
            }, 0.5);
        }else { // 强制胡
            this.scheduleOnce(() => {
                cc.dd.roomEvent.setIsCache(true);
                cc.dd.roomEvent.notifyCacheList();
            });
        }
    },
    // 结算
    oneGameOver(data) {
        cc.dd.roomEvent.setIsCache(false);
        this.cleanDesk();
        cc.dd.Reload.loadPrefab("Game/Prefab/JieSuan", (prefab) => {
            const gameOver = cc.instantiate(prefab);
            gameOver.getComponent("NewGameOver").initNote(data, this);
            this.node.addChild(gameOver);
        });
        // this.scheduleOnce(() => {
        //     cc.dd.roomEvent.setIsCache(true);
        //     cc.dd.roomEvent.notifyCacheList();
        // }, 2);
    },
    // 玩家听牌
    playerTingCard(data) {
        cc.dd.roomEvent.setIsCache(false);

        cc.dd.playEffect(2, cc.dd.soundName.V_TING);
        cc.dd.Reload.loadPrefab("Game/Prefab/TingAni", (prefab) => {
            const gangAni = cc.instantiate(prefab);
            this.playerArr[localSeat - 1].getChildByName("AniNode").addChild(gangAni);
        });

        const localSeat = this.getLocalSeatByUserId(data.tinguid);
        this.playerArr[localSeat - 1].getChildByName("InfoBk").getChildByName("Ting").active = true;

        if (localSeat == 1) {
            cc.dd.cardMgr.setIsTing(true);
        }
        const cardNode = this.playerArr[0].getChildByName("HandCardLayer").getChildByName("HandCardLay");
        cardNode.children.forEach((card) => {
            card.getChildByName("TingSign").active = false;
        });
        this.scheduleOnce(() => {
            cc.dd.roomEvent.setIsCache(true);
            cc.dd.roomEvent.notifyCacheList();
        }, 0.5);//add by ycjia 2017-11-19
    },
    // 更换宝牌
    baoCardChange(data) {
        cc.dd.roomEvent.setIsCache(false);
        this.setBaoCard(true, data.baocard);
        this.scheduleOnce(() => {
            cc.dd.roomEvent.setIsCache(true);
            cc.dd.roomEvent.notifyCacheList();
        }, 0.5);
    },
    haiDiLao(data) {
        cc.dd.roomEvent.setIsCache(false);
        const localSeat = this.getLocalSeatByUserId(data.uid);
        if (localSeat === 1) {
            if (data.forcehu) {
                cc.log(`玩家必须胡牌`);
                cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_HUCARD_REP);
            }
        }
        const card = this.playerArr[localSeat - 1].getChildByName("HuInfo").getChildByName("HuCard");
        const haidilao = this.playerArr[localSeat - 1].getChildByName("HuInfo").getChildByName("HaiDiLao");
        card.getComponent("CardSpr").initCard(data.mopai);
        card.active = true;
        haidilao.active = true;
            this.scheduleOnce(() => {
                // cc.dd.room.huing = null;
                cc.dd.roomEvent.setIsCache(true);
                cc.dd.roomEvent.notifyCacheList();
            }, 2);

    },

    // 指针转动
    timerRatation(data) {
        cc.dd.roomEvent.setIsCache(false);
        const localSeat = this.getLocalSeatByUserId(data.pointtouid);
        this.playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
        if (data.mopai) {
            if (localSeat !== 1) {
                this.playerMoCard(data, data.pointtouid);
            }
        }
        if (localSeat) {
            this.TimerNode.getComponent("TimerControl").ratateTimer(localSeat);
        } else {
            cc.log(`未知的本地座位号: ${userid}`);
        }
        if (localSeat === cc.dd.gameCfg.PLAYER_SEAT_LOCAL.BOTTOM) {
            cc.log(`轮到自己操作`);
            
            //指针转到自己就可以出牌是不严谨的，应该是吃、碰成功、摸牌(非听牌状态)以后才可以手动出牌
            //cc.dd.cardMgr.setIsCanOutCard(true);
            //比如听牌状态，指针转到自己但还未收到摸牌指令，此时玩家是可以出牌的，就会导致手牌变少

            if (!this.playerArr[0].getComponent("PlayerSelf").getTingBtnState()) {
                if (!cc.dd.cardMgr.getIsTing()) {
                    let operateData = {};
                    if (cc.dd.cardMgr.getTingList()) {
                        if (cc.dd.cardMgr.getTingList().length > 0) {
                            operateData.ting = true;
                        }
                        this.playerArr[0].getComponent("PlayerSelf").showOperateBtn(operateData);
                    }
                }
            } else {
                cc.dd.cardMgr.setTingList(null);
            }
            if (cc.dd.cardMgr.getReadyOutCard()) {
                cc.dd.cardMgr.getReadyOutCard().getComponent("Card").cancelSelect();
                cc.dd.cardMgr.setReadyOutCard(null);
            }
        } else {
            cc.log(`不是自己操作, 不能出牌`);
            cc.dd.cardMgr.setIsCanOutCard(false);
        }

        this.scheduleOnce(() => {
            cc.dd.roomEvent.setIsCache(true);
            cc.dd.roomEvent.notifyCacheList();
        },0.4);
    },
    // 显示听牌的标志
    showTingSign() {
        const tingList = cc.dd.cardMgr.getTingList();
        if (tingList) {
            const cardNode = this.playerArr[0].getChildByName("HandCardLayer").getChildByName("HandCardLay");
            let hasTing = false;
            tingList.forEach((item) => {
                cardNode.children.forEach((card) => {
                    if (item == card.cardId) {
                        card.getChildByName("TingSign").active = true;
                        hasTing = true;
                    }
                });
            });
            const moCard = this.playerArr[0].getChildByName("HandCardLayer").getChildByName("MoCardLayer");
            tingList.forEach((item) => {
                moCard.children.forEach((card) => {
                    if (item == card.cardId) {
                        card.getChildByName("TingSign").active = true;
                        hasTing = true;
                    }
                });
            });
            // if (hasTing) {
            //     cc.dd.Reload.loadPrefab("Game/Prefab/BuTing", (prefab) => {
            //         const buting = cc.instantiate(prefab);
            //         this.node.addChild(buting);
            //     });
            // }
        }
    },
    /**
     *  清理桌面
     */
    cleanDesk() {
        this.playerArr.forEach((item) => {
            const handNode = item.getChildByName("HandCardLayer").getChildByName("HandCardLay");
            const outNode = item.getChildByName("OutCardLayer");
            const moNode = item.getChildByName("HandCardLayer").getChildByName("MoCardLayer");
            const pengGangNode = item.getChildByName("PengGangLayer");
            handNode.removeAllChildren(true);
            moNode.removeAllChildren(true);
            pengGangNode.removeAllChildren(true);
            // // 清空手牌
            // handNode.children.forEach((item) => {
            //     item.destroy();
            //     item.removeFromParent();
            // });
            // // 清空摸牌
            // moNode.children.forEach((item) => {
            //     item.destroy();
            //     item.removeFromParent();
            // });
            // // 清空碰刚拍
            // pengGangNode.children.forEach((item) => {
            //     item.destroy();
            //     item.removeFromParent();
            // });
            // 清空出牌
            const outNode1 = outNode.getChildByName("OutCardLayer1");
            const outNode2 = outNode.getChildByName("OutCardLayer2");
            const outNode3 = outNode.getChildByName("OutCardLayer3");
            outNode1.removeAllChildren(true);
            outNode2.removeAllChildren(true);
            outNode3.removeAllChildren(true);
            // outNode1.children.forEach((item) => {
            //     item.destroy();
            //     item.removeFromParent();
            // });
            // outNode2.children.forEach((item) => {
            //     item.destroy();
            //     item.removeFromParent();
            // });
            // outNode3.children.forEach((item) => {
            //     item.destroy();
            //     item.removeFromParent();
            // });

            // 清理听得标志
            item.getChildByName("InfoBk").getChildByName("Ting").active = false;
            const huInfo = item.getChildByName("HuInfo");
            huInfo.children.forEach((note) => {
                note.active = false;
            });

            // 清理数组
            item.mesArr = [];
            // item.outCardArr = [];
            item.outPengArr = [];

        });
        cc.dd.cardMgr.setReadyOutCard(null);
        this.playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
        cc.dd.cardMgr.setHuiPai(null);
        cc.dd.cardMgr.setChiList(null);
        cc.dd.cardMgr.setTingList(null);
        cc.dd.cardMgr.setIsTing(false);
        cc.dd.cardMgr.setMoCard(null);
        cc.dd.cardMgr.setZiMoGang(null);
        cc.dd.cardMgr.setCurOutCard(null);
        cc.dd.cardMgr.setCurZiMoGangCard(null);
        cc.dd.room._curentChuPaiSeat = null;
    },
    /**
     *  根据玩家id返回本地座位号
     * @param userid
     */
    getLocalSeatByUserId(userid) {
        let localSeat = 0;
        this.playerArr.forEach((item) => {
            if (item.userInfo) {
                if (item.userInfo.UID === userid) {
                    localSeat = item.localSeat;
                }
            }
        });
        return localSeat;
    },
    // 获取当前时间
    updateCurrentTime() {
        let date = new Date();
        let str = "";
        if (date.getHours()<10 ||date.getMinutes()<10) {
            if(date.getHours()<10){
                str = "0"+date.getHours();
            }else {
                str = date.getHours();
            }
            if(date.getMinutes()<10) {
                str = str + ":" + "0"+date.getMinutes();
            }else {
                str = str + ":" + date.getMinutes();
            }
        }else {
            str = date.getHours() + ":" + date.getMinutes();
        }
        if (this.TimeLabel) {
            this.TimeLabel.string = str;
        }
    },
    // 是否充电状态
    updateChargingSign(data) {
        cc.log("充电状态更新");
        this.ChargingSignImage.active = data;
    },
    // 电量更新
    updateBatteryLevelProgressBar(data) {
        cc.log("电量更新");
        this.BatteryImage.progress = data;
    },
    onClickCopyRoom() {
        cc.log("复制房间号");
        cc.dd.accessPatseBoard(this.RoomIDLabel.string);
    },
    onClickInviteFriends() {
        cc.log("邀请微信朋友");
        let str = "";
        //wanfaSet
        cc.dd.room._roomRules.forEach((item) => {
            if(!str){
            str = PLAY_OPERA_NAME_ORAL[item];
            }else {
            str = str + " 、" + PLAY_OPERA_NAME_ORAL[item];
            }
            });
        var contentstr = this.RoomIDLabel.string + " 本房间玩法：" + str;
        // cc.dd.invokeWXFriendShareCustumText(contentstr);
        cc.dd.invokeWXFriendShareCustumText(contentstr, this.roomPassword);
    },
    // 给发言用户显示语音图标
    onRecievedPlayerMessage(data) {
        cc.dd.roomEvent.setIsCache(false);
        var localSeat = null;
        if(data) {
            localSeat = this.getLocalSeatByUserId(data.senduid);
        }else {
            localSeat = cc.dd.room._currentMessageSeatID;
        }
        if (localSeat) {
            if(data) {
                this.playerArr[localSeat-1].mesArr.push(data.voiceid); // 给他的语音数组赋值
                this.playerArr[localSeat-1].getChildByName("InfoBk").getChildByName("message_receiver").active = true;
            }
            if(!cc.dd.room._hasMessageOnPlay) {
                cc.dd.room._hasMessageOnPlay = true;
                cc.dd.room._currentMessageSeatID = localSeat;
                cc.dd.soundMgr.pauseAllSounds();
                cc.dd.room._currentMessageID = this.playerArr[localSeat-1].mesArr[0];
                this.playerArr[localSeat-1].getChildByName("InfoBk").getChildByName("message_receiver").getComponent(cc.Animation).play();
                cc.dd.downloadAndPlayMessageWithMessageID(cc.dd.room._currentMessageID);
            }
        }
        cc.dd.roomEvent.setIsCache(true);
        cc.dd.roomEvent.notifyCacheList();
    },
    // 成功播放完当前消息的回调的处理
    didFinishPlayingCurrentMessage() { // 联续播放
        const localSeat = cc.dd.room._currentMessageSeatID;
        this.playerArr[localSeat-1].mesArr.splice(0,1);
        this.playerArr[localSeat-1].getChildByName("InfoBk").getChildByName("message_receiver").getComponent(cc.Animation).stop();
        if(this.playerArr[localSeat-1].mesArr.length > 0) {
            cc.dd.room._hasMessageOnPlay = false;
            const nextlocalSeat = this.getLocalSeatByUserId(this.playerArr[localSeat-1].mesArr[0].senduid);
            if(localSeat != nextlocalSeat) {
                cc.dd.room._currentMessageSeatID = nextlocalSeat;
            }
            this.onRecievedPlayerMessage();
        }else {
            cc.dd.room._hasMessageOnPlay = false;
            cc.dd.soundMgr.resumeAllSounds();
            cc.dd.room._currentMessageSeatID = null;
            cc.dd.room._currentMessageID = null;
            this.scheduleOnce(function() {
                this.playerArr[localSeat-1].getChildByName("InfoBk").getChildByName("message_receiver").active = false;
                cc.dd.soundMgr.resumeAllSounds();
            }, 1.5);
        }
    },
    onClickExchangeFangKa() { // 弃用
        cc.dd.Reload.loadPrefab("Hall/Prefab/ChangeFanKa", (prefab) => {
            const changePup = cc.instantiate(prefab);
            this.node.addChild(changePup);
        });
    },
    userDidOffline(data) {
        const localSeat = this.getLocalSeatByUserId(data.UID);
        this.playerArr[localSeat-1].getChildByName("InfoBk").getChildByName("offline").active = true;
    },
    userDidComebackOnline(data) {
        const localSeat = this.getLocalSeatByUserId(data.UID);
        this.playerArr[localSeat-1].getChildByName("InfoBk").getChildByName("offline").active = false;
    },
    // 更新函数
    update() {
        cc.dd.updataPollFunc();
    },
});
