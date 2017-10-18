cc.Class({
    extends: cc.Component,

    properties: {
        LeftContent: {
            default: null,
            type: cc.Node,
            tooltip: "左边的容器",
        },
        RightContent: {
            default: null,
            type: cc.Node,
            tooltip: "右边的容器",
        },
        HuanJuNode: {
            default: null,
            type: cc.Node,
            tooltip: "黄局",
        },
        JuNode: {
            default: null,
            type: cc.Label,
            tooltip: "局数信息",
        },
        NextBtn: {
            default: null,
            type: cc.Node,
            tooltip: "下一句的按钮",
        },
        ReturnBtn: {
            default: null,
            type: cc.Node,
            tooltip: "返回的按钮",
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     *  初始化内容
     */
    initNote(data, target) {
        // 更新局数信息
        if (this.JuNode) {
            this.JuNode.string = `第${data.nowround}/${data.rounds}局`
            if (data.nowround === data.rounds) {
                this.showBtn(true);
            } else {
                this.showBtn(false);
            }
        }
        // 是否黄局
        if (this.HuanJuNode) {

        }
        // 渲染左边内容
        cc.dd.Reload.loadPrefab("Game/Prefab/LeftNote", (prefab) => {
            data.userlist.forEach((item) => {
                const left = cc.instantiate(prefab);
                left.getComponent("GO_LeftNote").initNote(item);
                this.LeftContent.addChild(left);
            });
        });
        // 渲染右边的信息
        cc.dd.Reload.loadPrefab("Game/Prefab/RightNote", (prefab) => {
            data.userlist.forEach((item) => {
                const right = cc.instantiate(prefab);
                right.getComponent("GO_RightNote").initNote(item, {huType: data.hutype, dianpaouid: data.dianpaouid});
                this.RightContent.addChild(right);
            });
        });
        data.userlist.forEach((item) => {
            this.showCard(item, target);
        });
    },
    /**
     *  显示牌
     */
    showCard(data, target) {
        let parantNode = null;
        switch (target.getLocalSeatByUserId(data.UID)) {
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.BOTTOM: {
                parantNode = this.node.getChildByName("Bottom");
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.TOP: {
                parantNode = this.node.getChildByName("Up");
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.LEFT: {
                parantNode = this.node.getChildByName("Left");
                break;
            }
            case cc.dd.gameCfg.PLAYER_SEAT_LOCAL.RIGHT: {
                parantNode = this.node.getChildByName("Right");
                break;
            }
            default: {
                cc.log('不知名的位置:', target.getLocalSeatByUserId(data.UID));
                break;
            }
        }
        cc.dd.Reload.loadAtlas("Game/Atlas/gameOver", (atlas) => {
            // 手牌
            if (data.handcards) {
                cc.dd.Reload.loadPrefab("Game/Prefab/GO_HandPoker", (prefab) => {
                    data.handcards.forEach((item) => {
                        const card = cc.instantiate(prefab);
                        const str = "little_card_" + (item  + 1);
                        card.getChildByName("Spr").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(str);
                        parantNode.getChildByName("HandCard").addChild(card);
                    });
                });
            }
            // 碰的牌
            cc.dd.Reload.loadPrefab("Game/Prefab/GO_PengGang", (prefab) => {
                const pengGangNode = parantNode.getChildByName("PengGang");
                if (data.pengcards) {
                    data.pengcards.forEach((item) => {
                        const penggang = cc.instantiate(prefab);
                        const str = "little_card_" + (item  + 1);
                        penggang.children.forEach((card) => {
                            card.getChildByName("Spr").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(str);
                        });
                        pengGangNode.addChild(penggang);
                    });
                }
                // 杠的牌
                if (data.gangcards) {
                    data.gangcards.forEach((item) => {
                        const penggang = cc.instantiate(prefab);
                        const str = "little_card_" + (item  + 1);
                        penggang.children.forEach((card) => {
                            card.getChildByName("Spr").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(str);
                            card.active = true;
                        });
                        pengGangNode.addChild(penggang);
                    });
                }
                // 吃的牌
                if (data.chicards) {
                    data.chicards.forEach((item) => {
                        const penggang = cc.instantiate(prefab);
                        let index = 0;
                        penggang.children.forEach((card) => {
                            const str = "little_card_" + (item[index]  + 1);
                            if (card.name !== "Gang") {
                                card.getChildByName("Spr").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(str);
                                index ++;
                            }
                        });
                        pengGangNode.addChild(penggang);
                    });
                }
            });
        });
    },
    // 显示按钮
    showBtn(state) {
        if (state) {
            this.ReturnBtn.active = true;
        } else {
            this.NextBtn.active = true;
        }
    },
    // 下一句监听事件
    nextBtnClick() {
        this.node.destroy();
        cc.dd.roomEvent.setIsCache(true);
        cc.dd.roomEvent.notifyCacheList();
    },
    // 返回监听的事件
    returnBtnClick() {
        cc.log(`返回`);
    },
});
