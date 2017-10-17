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
    },

    // use this for initialization
    onLoad: function () {
        // 屏幕适配

        cc.dd.appUtil.setScreenFit(this.node);
        cc.dd.soundMgr.playMusic("resources/Game/Sound/common/bg.mp3", true);

        this.initPlayerArr();
        // 测试手牌
       // this.PlayerNode.getChildByName("Bottom").getComponent("PlayerSelf").createHandCard(cardArr);

        cc.dd.roomEvent.notifyMsg();
    },

    // 初始化玩家的列表
    initPlayerArr() {
        this.playerArr.push(this.PlayerNode.getChildByName("Bottom"));
        this.PlayerNode.getChildByName("Bottom").localSeat = 1;
        this.playerArr.push(this.PlayerNode.getChildByName("Right"));
        this.PlayerNode.getChildByName("Right").localSeat = 2;
        this.playerArr.push(this.PlayerNode.getChildByName("Top"));
        this.PlayerNode.getChildByName("Top").localSeat = 3;
        this.playerArr.push(this.PlayerNode.getChildByName("Left"));
        this.PlayerNode.getChildByName("Left").localSeat = 4;
    },
    // 初始化玩家
    initPlayerSeat(data) {
        const userList = this.sortUserList(data.myuid);
        cc.dd.roomEvent.setIsCache(false);
        cc.dd.cardMgr.setHuiPai(data.room.guicard);
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
            this.playerArr[index].userInfo = item;
            // 渲染出的牌
            this.playerOutCard({chupai: item.playedcards, senduid: item.UID, notDes: true});
            // 渲染碰的牌
            if (item.pengcards) {
                item.pengcards.forEach((pengcard) => {
                    this.playerPengCard({pengpai: pengcard, penguid: item.UID, notDes: true});
                });
            }
            // 渲染暗杠的牌
            if (item.angangcards) {
                item.angangcards.forEach((gangcard) => {
                    this.playerGangCard({ganguid: item.UID, gangpai: gangcard, angang: true, notDes: true});
                });
            }
            // 渲染明杠的牌
            if (item.minggangcards) {
                item.minggangcards.forEach((gangcard) => {
                    this.playerGangCard({ganguid: item.UID, gangpai: gangcard, angang: false, notDes: true});
                });
            }
            // 渲染吃的牌
            if (item.showcards) {
                item.showcards.forEach((item) => {
                    this.playerChiCard({straight: item, chipaiuid: item.UID, notDes: true});
                });
            }

        });
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
                cc.dd.user.setUserInfo(item);
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
    // 玩家出牌
    playerOutCard(data) {
        if (!data.notDes) {
            cc.dd.roomEvent.setIsCache(false);
        }
        const localSeat = this.getLocalSeatByUserId(data.senduid);
        if (localSeat) {
            const outNode = this.playerArr[localSeat - 1].getChildByName("OutCardLayer");
            if (data.chupai instanceof Array) {
                data.chupai.forEach((item) => {
                    cc.dd.cardMgr.outCard(outNode, localSeat, item, data.notDes);
                });
            } else {
                cc.dd.cardMgr.outCard(outNode, localSeat, data.chupai);
            }
        } else {
            cc.error(`本地座位号未找到！！！`);
        }

        // 有碰刚胡时显示操作按钮
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
        cc.dd.roomEvent.setIsCache(false);
        const localSeat = this.getLocalSeatByUserId(data.chipaiuid);
        if (localSeat) {
            const pengNode = this.playerArr[localSeat - 1].getChildByName("PengGangLayer");
            cc.dd.cardMgr.pengGangCard(pengNode, localSeat, data, cc.dd.gameCfg.OPERATE_TYPE.CHI);
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
        if (!data.notDes) {
            cc.dd.roomEvent.setIsCache(false);
        }
        const localSeat = this.getLocalSeatByUserId(data.penguid);
        if (localSeat) {
            const pengNode = this.playerArr[localSeat - 1].getChildByName("PengGangLayer");
            cc.dd.cardMgr.pengGangCard(pengNode, localSeat, data, cc.dd.gameCfg.OPERATE_TYPE.PENG);
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
        if (!data.notDes) {
            cc.dd.roomEvent.setIsCache(false);
        }
        const localSeat = this.getLocalSeatByUserId(data.ganguid);
        if (localSeat) {
            const pengNode = this.playerArr[localSeat - 1].getChildByName("PengGangLayer");
            cc.dd.cardMgr.pengGangCard(pengNode, localSeat, data, cc.dd.gameCfg.OPERATE_TYPE.GANG);
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
    // 玩家胡牌
    playerHuCard(data) {
        cc.dd.roomEvent.setIsCache(false);
        const localSeat = this.getLocalSeatByUserId(data.huuid);
        if (localSeat) {

        } else {
            cc.error(`本地座位号未找到！！！`);
        }
        this.scheduleOnce(() => {
            cc.dd.roomEvent.setIsCache(true);
            cc.dd.roomEvent.notifyCacheList();
        }, 0.5);
    },
    // 玩家摸牌
    playerMoCard(data, userid) {
        cc.dd.roomEvent.setIsCache(false);
        const localSeat = this.getLocalSeatByUserId(userid);
        if (localSeat) {
            const moNode = this.playerArr[localSeat - 1].getChildByName("HandCardLayer").getChildByName("MoCardLayer");
            cc.dd.cardMgr.MoCard(moNode, localSeat, data);
        } else {
            cc.error(`本地座位号未找到！！！`);
        }
        this.scheduleOnce(() => {
            cc.dd.roomEvent.setIsCache(true);
            cc.dd.roomEvent.notifyCacheList();
        }, 0.5);
    },
    // 结算
    oneGameOver(data) {
        cc.dd.roomEvent.setIsCache(false);
        this.cleanDesk();
        cc.dd.Reload.loadPrefab("Game/Prefab/OneGameOver", (prefab) => {
            const gameOver = cc.instantiate(prefab);
            gameOver.getComponent("GameOver").initNote(data, this);
            this.node.addChild(gameOver);
        });
        // this.scheduleOnce(() => {
        //     cc.dd.roomEvent.setIsCache(true);
        //     cc.dd.roomEvent.notifyCacheList();
        // }, 2);
    },

    // 指针转动
    timerRatation(data) {
        cc.dd.roomEvent.setIsCache(false);
        const localSeat = this.getLocalSeatByUserId(data.pointtouid);
        if (data.mopai) {
            this.playerMoCard(data, data.pointtouid);
        }
        if (localSeat) {
            this.TimerNode.getComponent("TimerControl").ratateTimer(localSeat);
        } else {
            cc.log(`未知的本地座位号: ${userid}`);
        }
        if (localSeat === cc.dd.gameCfg.PLAYER_SEAT_LOCAL.BOTTOM) {
            cc.log(`轮到自己操作`);
            cc.dd.cardMgr.setIsCanOutCard(true);
        } else {
            cc.log(`不是自己操作, 不能出牌`);
            cc.dd.cardMgr.setIsCanOutCard(false);
        }
        this.playerArr[0].getComponent("PlayerSelf").hideOperateBtn();

        this.scheduleOnce(() => {
            cc.dd.roomEvent.setIsCache(true);
            cc.dd.roomEvent.notifyCacheList();
        }, 0.5);
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

        });
        cc.dd.cardMgr.setReadyOutCard(null);
        this.playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
        cc.dd.cardMgr.setHuiPai(null);
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
});
