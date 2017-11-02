const JIESUAN_HU_TYPE_NAME = [
    null,
    "zimo",
    "pinghu",
    "sihui",
    "duibao",
    "loubao",
    "gangshanghua",
    "huangju",
];
cc.Class({
    extends: cc.Component,

    properties: {
        CenterContent: {
            default: null,
            type: cc.Node,
            tooltip: "四人分数的容器",
        },
        winnerCards: {
            default: null,
            type: cc.Node,
            tooltip: "赢家牌面",
        },
        GuiPaiNode: {
            default: null,
            type: cc.Node,
            tooltip: "鬼牌",
        },
        BaoPaiNode: {
            default: null,
            type: cc.Node,
            tooltip: "宝牌",
        },
        HuTypeSprite: {
            default: null,
            type: cc.Sprite,
            tooltip: "胡牌类型",
        },
        NextBtn: {
            default: null,
            type: cc.Node,
            tooltip: "下一局的按钮",
        },
        NextBtnTitle: {
            default: null,
            type: cc.Label,
            tooltip: "下一局按钮的label",
        },
        ReturnBtn: {
            default: null,
            type: cc.Node,
            tooltip: "返回的按钮",
        },
        // GangPonitTitle: {
        //     default: null,
        //     type: cc.Sprite,
        //     tooltip: "杠分/总分",
        // },
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     *  初始化内容
     */
    initNote(data, target) {
        // 更新局数信息
        if (this.NextBtn) {
            // this.NextBtn.getCompnent("label").string = `第${data.nowround}/${data.rounds}局`;
            this.NextBtnTitle.string = `开始下一局（${data.nowround+1}）`;
            if (cc.dd.room._subcommand == 4) {
                this.showBtn(true); // 显示返回按钮
            } else {
                this.showBtn(false);
            }
        }
        // 胡牌类型
        if(this.HuTypeSprite) {
            cc.dd.Reload.loadAtlas("Game/Atlas/hutype", (atlas) => {
                if(data.hutype == -1) {
                    this.HuTypeSprite.spriteFrame = atlas.getSpriteFrame(JIESUAN_HU_TYPE_NAME[7]);
                }else {
                    this.HuTypeSprite.spriteFrame = atlas.getSpriteFrame(JIESUAN_HU_TYPE_NAME[data.hutype]);
                }
            });
        }
        if(data.hutype == -1) {
            this.GuiPaiNode.active = false;
            this.BaoPaiNode.active = false;
            this.winnerCards.active = false;
            cc.dd.room._guipai = data.guicard;
            //改杠为总
            // cc.dd.Reload.loadAtlas("Game/Atlas/gameOverAl", (atlas) => {
            //     this.GangPonitTitle.spriteFrame = atlas.getSpriteFrame("zong@2x");
            // });
            // 四人分数
            cc.dd.Reload.loadPrefab("Game/Prefab/InnerGameRecord", (prefab) => {
                data.userlist.forEach((item) => {
                const Record = cc.instantiate(prefab);
                Record.getComponent("GameOverItem").initHuangjuInfo(item);
                this.CenterContent.addChild(Record);
                });
            });
        }else {
            // 鬼牌
            this.initGuiCard(data.guicard);
            // 宝牌
            this.setBaoCard(data.baocard);
            // 保存赢家id
            cc.dd.room._winneruid = data.winneruid;
            cc.dd.room._dianpaouid = data.dianpaouid;
            cc.dd.room._guipai = data.guicard;
            // 赢家牌面
            this.presentCards(data);
            // 四人分数
            cc.dd.Reload.loadPrefab("Game/Prefab/InnerGameRecord", (prefab) => {
                data.userlist.forEach((item) => {
                const Record = cc.instantiate(prefab);
                Record.getComponent("GameOverItem").initInfo(item);
                this.CenterContent.addChild(Record);
                });
            });
        }

    },
    // 显示按钮
    showBtn(state) {
        if (state) {
            this.ReturnBtn.active = true;
            this.NextBtn.active = false;
        }else {
            this.NextBtn.active = true;
            this.ReturnBtn.active = false;
        }
    },
    // 下一句监听事件
    nextBtnClick() {
        this.node.destroy();
        cc.dd.roomEvent.setIsCache(true);
        cc.dd.roomEvent.notifyCacheList();
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_JIESUAN_START_NEXTROUND);
    },
    // 返回监听的事件
    returnBtnClick() {
        cc.log(`返回`);
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_JIESUAN_START_NEXTROUND);
        cc.dd.soundMgr.stopAllSound();
        cc.dd.Reload.loadDir("DirRes", () => {
            cc.dd.sceneMgr.runScene(cc.dd.sceneID.HALL_SCENE);
        });
    },
    // 鬼牌
    initGuiCard(data) {
        if (this.GuiPaiNode) {
            if (data || data == 0) {
                this.GuiPaiNode.getComponent("CardSpr").initCard(data);
                this.GuiPaiNode.active = true;
            } else {
                this.GuiPaiNode.active = false;
            }
        }
    },
    // 设置宝牌
    setBaoCard(data) {
        if (this.BaoPaiNode) {
                if (data || data == 0) {
                    this.BaoPaiNode.active = true;
                    const card = this.BaoPaiNode.getChildByName("BaoCard");
                    card.active = true;
                    this.BaoPaiNode.getComponent("CardSpr").initCard(data);
                }else {
                    this.BaoPaiNode.active = false;
                }
        }
    },
    /**
     *  初始化赢家牌面
     * @param data
     */
    presentCards(data) {
        let parantNode = this.winnerCards;
        cc.dd.Reload.loadAtlas("Game/Atlas/gameOver", (atlas) => {
            const handcardNode = parantNode.getChildByName("HandCard");
            // 手牌
            if (data.winnerhandcards) {
            cc.dd.Reload.loadPrefab("Game/Prefab/GO_HandPoker", (prefab) => {
                data.winnerhandcards.forEach((item) => {
                const card = cc.instantiate(prefab);
                const str = "little_card_" + (item +1);
                card.getChildByName("Spr").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(str);
                // 加鬼牌遮罩 Giupai
                if(cc.dd.room._guipai == item){
                    card.getChildByName("Giupai").active = true;
                }
                handcardNode.addChild(card);
        });
        });
        }
        if(data.hucard || data.hucard == 0) {
            cc.dd.Reload.loadPrefab("Game/Prefab/GO_HandPoker", (prefab) => {
                const card = cc.instantiate(prefab);
                const str = "little_card_" + (data.hucard+1);
                card.getChildByName("Spr").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(str);
                if(cc.dd.room._guipai == data.hucard){
                    card.getChildByName("Giupai").active = true;
                }
                parantNode.getChildByName("HuCard").addChild(card);
            });
        }
        // 碰的牌
        cc.dd.Reload.loadPrefab("Game/Prefab/GO_PengGang", (prefab) => {
            const pengGangNode = parantNode.getChildByName("PengGang");
            if (data.winnerpengcards) {
                data.winnerpengcards.forEach((item) => {
                const penggang = cc.instantiate(prefab);
                const str = "little_card_" + (item  + 1);
                penggang.children.forEach((card) => {
                card.getChildByName("Spr").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(str);
            });
            pengGangNode.addChild(penggang);
        });
        }
        // 杠的牌
        if (data.winnergangcards) {
            data.winnergangcards.forEach((item) => {
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
        if (data.winnerchicards) {
            data.winnerchicards.forEach((item) => {
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
});
