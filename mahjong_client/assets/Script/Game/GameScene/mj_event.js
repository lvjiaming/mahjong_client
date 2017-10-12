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
                this.node.getComponent("mj_gameScene").initPlayerSeat();
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
                this.node.getComponent("mj_gameScene").playerMoCard(data);
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },

});
