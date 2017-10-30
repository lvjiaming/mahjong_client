cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },
    // 返回
    onReturnClick() {
        cc.log(`返回`);
    },
    // 扩展tool,isagent为1的时候才显示转让房卡
    onKuoZhanClick() {
        cc.log(`扩展，${cc.dd.user.getUserInfo().isagent}`);
        if (!cc.dd.user.getUserInfo().isagent || (cc.dd.user.getUserInfo().isagent == 0)){
            cc.dd.Reload.loadPrefab("Game/Prefab/NoKFKZTool", (prefan) => {
                const kzTool = cc.instantiate(prefan);
            this.node.addChild(kzTool);
            });
        }else {
            cc.dd.Reload.loadPrefab("Game/Prefab/KuoZhanTool", (prefan) => {
                const kzTool = cc.instantiate(prefan);
            this.node.addChild(kzTool);
            });
        }
    },
    // 语音
    onSoundClick() {
        cc.log(`语音`);
    },
    // 碰
    onPengClick() {
        cc.log(`发送碰牌请求`);
        this.node.getComponent("mj_gameScene").playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_PENGCARD_REP);
    },
    // 杠
    onGangClick() {
        cc.log(`发送杠牌请求`);
        const gangList = cc.dd.cardMgr.getZiMoGang();
        if (gangList) {
            if (gangList.length == 1) {
                cc.dd.cardMgr.setCurZiMoGangCard(gangList[0]);
                this.node.getComponent("mj_gameScene").playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
                cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_GANGCARD_REP, gangList[0]);
            } else {
                cc.dd.Reload.loadPrefab("Game/Prefab/GangSelect", (prefab) => {
                    const gangLayer = cc.instantiate(prefab);
                    gangLayer.getComponent("GangSelect").initCard(gangList);
                    this.node.addChild(gangLayer);
                });
            }
        } else {
            this.node.getComponent("mj_gameScene").playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_GANGCARD_REP);
        }
    },
    onHuClick() {
        cc.log(`发送胡牌请求`);
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_HUCARD_REP);
    },
    // 过
    onGuoClick(event) {
        cc.log(`过牌`);
        this.node.getComponent("mj_gameScene").playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_GUOCARD_REP);
        if (event.target.isOnlyTing) {
            cc.dd.cardMgr.setIsCanOutCard(true);
            cc.dd.cardMgr.setTingList(null);
            return;
        }
        if ( event.target.customData) {
            cc.dd.cardMgr.setIsCanOutCard(true);
            if (cc.dd.cardMgr.getIsTing()) {
                const moCard = cc.dd.cardMgr.getMoCard();
                if (moCard) {
                    const moNode = this.node.getComponent("mj_gameScene").playerArr[0].
                    getChildByName("HandCardLayer").getChildByName("MoCardLayer");
                    this.scheduleOnce(() => {
                        moNode.children.forEach((item) => {
                            item.destroy();
                        });
                        moNode.removeAllChildren();
                        const suit = parseInt(moCard / 9) + 1;
                        const num = moCard % 9 + 1;
                        cc.dd.playEffect(1, num, suit);
                        const outCardNode = this.node.getComponent("mj_gameScene").playerArr[0].getChildByName("OutCardLayer");
                        cc.dd.cardMgr.outCard(outCardNode, 1, moCard);
                        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_OUTCARD_REP, {id: moCard, tingpai: false});
                    }, 0.5);
                    return;
                }
            }
        } else {
            // cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_GUOCARD_REP);
        }
        if (cc.dd.cardMgr.getIsTing()) {
            cc.log(`听牌状态`);
            const moCard = this.node.getComponent("mj_gameScene").playerArr[0].getChildByName("HandCardLayer").getChildByName("MoCardLayer");
            if (moCard) {
                moCard.children.forEach((item) => {
                    const suit = parseInt(item.cardId / 9) + 1;
                    const num = item.cardId % 9 + 1;
                    cc.dd.playEffect(1, num, suit);
                    const outCardNode = this.node.getComponent("mj_gameScene").playerArr[0].getChildByName("OutCardLayer");
                    cc.dd.cardMgr.outCard(outCardNode, 1, item.cardId);
                    cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_OUTCARD_REP, {id: item.cardId, tingpai: false});
                    item.removeFromParent(true);
                    item.destroy();
                });
            }
        }
    },
    // 吃
    onChiClick() {
        cc.log(`发送吃牌的请求`);
        const chiList = cc.dd.cardMgr.getChiList();
        if (chiList) {
            if (chiList.length == 1) {
                this.node.getComponent("mj_gameScene").playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
                cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHICARD_REP, chiList[0]);
            } else {
                cc.dd.Reload.loadPrefab("Game/Prefab/ChiSelect", (prefab) => {
                    const chiLayer = cc.instantiate(prefab);
                    chiLayer.getComponent("ChiSelect").initCard(chiList);
                    this.node.addChild(chiLayer);
                });
            }
        }
    },
    // 听
    onTingClick() {
        cc.log(`玩家听牌`);
        this.node.getComponent("mj_gameScene").showTingSign();
        this.node.getComponent("mj_gameScene").playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
        if (cc.dd.cardMgr.getTingList().length == 1) {
            const moCard = this.node.getComponent("mj_gameScene").playerArr[0].getChildByName("HandCardLayer").getChildByName("MoCardLayer");
            const handCard = this.node.getComponent("mj_gameScene").playerArr[0].getChildByName("HandCardLayer").getChildByName("HandCardLay");
            let hasRemove = false;
            moCard.children.forEach((card) => {
                if (cc.dd.cardMgr.getTingList()[0] == card.cardId) {
                    card.removeFromParent(true);
                    card.destroy();
                    hasRemove = true;
                }
            });
            if (!hasRemove) {
                handCard.children.forEach((card) => {
                    if (!hasRemove) {
                        if (cc.dd.cardMgr.getTingList()[0] == card.cardId) {
                            card.removeFromParent(true);
                            card.destroy();
                            hasRemove = true;
                        }
                    }
                });
            }
            const suit = parseInt(cc.dd.cardMgr.getTingList()[0] / 9) + 1;
            const num = cc.dd.cardMgr.getTingList()[0] % 9 + 1;
            cc.dd.playEffect(1, num, suit);
            const outCardNode = this.node.getComponent("mj_gameScene").playerArr[0].getChildByName("OutCardLayer");
            cc.dd.cardMgr.outCard(outCardNode, 1, cc.dd.cardMgr.getTingList()[0]);
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_OUTCARD_REP, {id: cc.dd.cardMgr.getTingList()[0], tingpai: true});
        }
        cc.dd.cardMgr.setIsCanOutCard(true);
    },
});
