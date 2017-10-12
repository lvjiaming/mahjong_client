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
    initPlayerSeat() {
        const userList = this.sortUserList();
        userList.forEach((item, index) => {
            this.playerArr[index].active = true;
            let player_class = null;
            // todo 测试代码（测试自己手牌的生成）
            //const handNode = this.playerArr[index].getChildByName("HandCardLayer").getChildByName("HandCardLay");
            //cc.dd.cardMgr.initHandCard(handNode, this.playerArr[index].localSeat, cardArr);

            if (index === 0) {
                cc.log(`初始化自己的信息`);
                player_class = this.playerArr[index].getComponent("PlayerSelf");
            } else {
                cc.log(`初始化其他玩家信息`);
                player_class = this.playerArr[index].getComponent("PlayerOther");
            }
            if (player_class) {
                player_class.initInfo(item);
            }
            this.playerArr[index].userInfo = item;
        });
    },
    /**
     *  排序玩家
     * @param arr
     */
    sortUserList() {
        const userList = cc.dd.room.userList;
        const selfInfo = cc.dd.user.getUserInfo();
        let idx = 0;
        const newUserList = [];
        userList.forEach((item, index) => {
            if (selfInfo.UID === item.UID) {
                idx = index;
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
        const localSeat = this.getLocalSeatByUserId(data.senduid);
        if (localSeat) {
            const pengNode = this.playerArr[localSeat - 1].getChildByName("PengGangLayer");
            cc.dd.cardMgr.outCard();
        } else {
            cc.error(`本地座位号未找到！！！`);
        }
    },
    // 玩家吃牌
    playerChiCard(data) {
        const localSeat = this.getLocalSeatByUserId(data.chipaiuid);
        if (localSeat) {

        } else {
            cc.error(`本地座位号未找到！！！`);
        }
    },
    // 玩家碰牌
    playerPengCard(data) {
        const localSeat = this.getLocalSeatByUserId(data.penguid);
        if (localSeat) {
            const pengNode = this.playerArr[localSeat - 1].getChildByName("PengGangLayer");
            cc.dd.cardMgr.pengGangCard();
        } else {
            cc.error(`本地座位号未找到！！！`);
        }
    },
    // 玩家杠牌
    playerGangCard(data) {
        const localSeat = this.getLocalSeatByUserId(data.ganguid);
        if (localSeat) {
            const pengNode = this.playerArr[localSeat - 1].getChildByName("PengGangLayer");
            cc.dd.cardMgr.pengGangCard();
        } else {
            cc.error(`本地座位号未找到！！！`);
        }
    },
    // 玩家胡牌
    playerHuCard(data) {
        const localSeat = this.getLocalSeatByUserId(data.huuid);
        if (localSeat) {

        } else {
            cc.error(`本地座位号未找到！！！`);
        }
    },
    // 玩家摸牌
    playerMoCard() {

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
