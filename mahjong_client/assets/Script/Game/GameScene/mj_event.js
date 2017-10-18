/*
 处理服务器返回的游戏里的数据
 */
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        cc.dd.roomEvent.addObserver(this);
        cc.dd.userEvent.addObserver(this);
        cc.dd.net.addObserver(this);
    },
    onDestroy() {
        cc.dd.roomEvent.removeObserver(this);
        cc.dd.userEvent.removeObserver(this);
        cc.dd.net.removeObserver(this);
    },

    onMessageEvent(event, data) {
        switch (event) {
            case cc.dd.roomEvName.ROOM_GAME_DATA: { // 房间信息
                this.node.getComponent("mj_gameScene").initPlayerSeat(data);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_OUTCARD_RAD: {  // 玩家出牌的广播
                cc.log(`玩家${data.senduid}出牌`);
                this.node.getComponent("mj_gameScene").playerOutCard(data);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHICARD_RAD: {  // 玩家吃牌的广播
                cc.log(`玩家${data.chipaiuid}吃牌`);
                this.node.getComponent("mj_gameScene").playerChiCard(data);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_PENGCARD_RAD: {  // 玩家碰牌的广播
                cc.log(`玩家${data.penguid}碰牌`);
                this.node.getComponent("mj_gameScene").playerPengCard(data);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_GANGCARD_RAD: {  // 玩家杠牌的广播
                cc.log(`玩家${data.ganguid}杠牌`);
                this.node.getComponent("mj_gameScene").playerGangCard(data);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_HUCARD_RAD: {  // 玩家胡牌的广播
                cc.log(`玩家${data.huuid}胡牌`);
                this.node.getComponent("mj_gameScene").playerHuCard(data);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_MOCARD_RAB: {  // 玩家摸牌的广播
                this.node.getComponent("mj_gameScene").playerMoCard(data, cc.dd.user.getUserInfo().UID);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_TIMER_SPRCIEL: {  // 指针转动
                this.node.getComponent("mj_gameScene").timerRatation(data);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ONE_GAME_OVER: { // 结算
                this.node.getComponent("mj_gameScene").oneGameOver(data);
                break;
            }
            case cc.dd.roomEvName.MSG_NOTIFY: {
                this.scheduleOnce(() => {
                    cc.dd.roomEvent.notifyCacheList();
                }, 0.5);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_ANOUNCE: {
                cc.log("收到4003");
                cc.dd.Reload.loadPrefab("Hall/Prefab/RoomDismiss", (prefab) => {
                    const RoomDismiss = cc.instantiate(prefab);
                    cc.find("UI_ROOT").addChild(RoomDismiss);
                });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_STATE: {
                cc.log("收到4004");
                cc.dd.Reload.loadPrefab("Hall/Prefab/progressBar", (prefab) => {
                    const bar = cc.instantiate(prefab);
                cc.find("UI_ROOT").addChild(bar);
                });
                break;
            }
            case  cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_RESULT: {
                if(data.success) {
                    cc.log("收到4008,成功解散房间：" + data.success);
                    cc.dd.soundMgr.stopAllSound();
                    cc.dd.Reload.loadDir("DirRes", () => {
                        cc.dd.sceneMgr.runScene(cc.dd.sceneID.HALL_SCENE);
                    });
                }else {
                    cc.log("收到4008,不解散房间：" + data.success);
                    // 条条节点干掉
                    // 弹窗也是
                }
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },

});
