/*
 处理服务器返回的游戏里的数据
 */
cc.Class({
    extends: cc.Component,

    properties: {
        didShowCountDownBar: null,
    },

    // use this for initialization
    onLoad: function () {
        cc.dd.tipMgr.init(this.node);
        cc.dd.roomEvent.addObserver(this);
        cc.dd.userEvent.addObserver(this);
        cc.dd.net.addObserver(this);
        cc.dd.user.getUserInfo().wereInGameSence = true;
        this.didShowCountDownBar = false;
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
            case cc.dd.gameCfg.EVENT.EVENT_PLAYER_TING_CARD: { // 玩家听牌
                this.node.getComponent("mj_gameScene").playerTingCard(data);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_BAO_CARD_CHANGE: { // 宝牌切换
                this.node.getComponent("mj_gameScene").baoCardChange(data);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_HAI_DI_LAO: { // 海底捞
                this.node.getComponent("mj_gameScene").haiDiLao(data);
                break;
            }
            case cc.dd.roomEvName.MSG_NOTIFY: {
                this.scheduleOnce(() => {
                    cc.dd.roomEvent.notifyCacheList();
                }, 0.8);
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
                if(cc.dd.room.userList.length > 1) {//一个在房间自动解散，不需要显示条条
                    if(this.didShowCountDownBar) {

                    }else {
                        this.didShowCountDownBar = true;
                        cc.dd.Reload.loadPrefab("Hall/Prefab/progressBar", (prefab) => {
                            const bar = cc.instantiate(prefab);
                        cc.find("UI_ROOT").addChild(bar);
                        });
                    }
                }
                break;
            }
            case  cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_RESULT: {
                if(data.success) {
                    cc.log("收到4008,成功解散房间：" + data.success);
                    cc.dd.Reload.loadPrefab("Hall/Prefab/AlertView", (prefab) => {
                        const exitroomsuc = cc.instantiate(prefab);
                    exitroomsuc.getComponent("AlterViewScript").initInfoMes("解散房间成功");
                    cc.find("UI_ROOT").addChild(exitroomsuc);
                    });
                }else {
                    cc.log("收到4008,不解散房间：" + data.success);
                    this.didShowCountDownBar = false;
                    // 弹窗节点干掉
                    this.node.getChildByName("RoomDismiss").removeFromParent();
                    // 条条节点干掉
                    this.node.getChildByName("progressBar").removeFromParent();
                    cc.dd.Reload.loadPrefab("Hall/Prefab/AlertView", (prefab) => {
                        const exitroomfail = cc.instantiate(prefab);
                    exitroomfail.getComponent("AlterViewScript").initInfoMes("解散房间失败");
                    cc.find("UI_ROOT").addChild(exitroomfail);
                    });
                }
                break;
            }
            case cc.dd.gameCfg.BATTERTY.BATTERTY_CHARGING: {
                this.node.getComponent("mj_gameScene").updateChargingSign(data);
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },

});
