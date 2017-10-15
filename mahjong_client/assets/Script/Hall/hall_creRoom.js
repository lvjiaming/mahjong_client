cc.Class({
    extends: cc.Component,

    properties: {
        HuiToggle: {
            default: null,
            type: cc.Toggle,
            tooltip: "玩法：会",
        },
        JiahuToggle: {
            default: null,
            type: cc.Toggle,
            tooltip: "玩法：夹胡",
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.dd.userEvent.addObserver(this);
        cc.dd.net.addObserver(this);
        this.JuShu = 16;
        this.FanShu = 1;
        this.WanFa = [1];
    },
    onDestroy() {
        cc.dd.userEvent.removeObserver(this);
        cc.dd.net.removeObserver(this);
    },
    // 局数
    onJuShuClick(event, custom) {
        const num = parseInt(custom);
        this.JuShu = num;
    },
    // 玩法
    onWanFaClick(event, custom) {
        const item = cc.dd.hall_config.CYMJ_WF[custom];
        if (event.isChecked) {
            cc.log("gotchecked");
            if (item == 3 || item == 5){
                // var hasThree = this.WanFa.some(function (eachItem,index,array) {
                //     cc.log(eachItem == 3);
                //     return (eachItem == 3);
                // });
                // var hasFive = this.WanFa.some(function (eachItem,index,array) {
                //     cc.log(eachItem == 5);
                //     return (eachItem == 5);
                // });
                this.WanFa.push(item);
                if (item == 3){
                    cc.log("是3有5了");
                    this.JiahuToggle.interactable = false;
                }
                if (item == 5){
                    cc.log("是5有3了");
                    this.HuiToggle.interactable = false;
                }
            }else {
                this.WanFa.push(item);
            }
        } else {
            this.WanFa.forEach((items, index) => {
                if (items == 3){
                    this.JiahuToggle.interactable = true;
                }
                if (items == 5){
                    this.HuiToggle.interactable = true;
                }
                if (item == items) {
                    this.WanFa.splice(index, 1);
                }
            });
        }
        cc.log(this.WanFa);
    },
    // 底番
    onDiFanClick(event, custom) {
        const num = parseInt(custom);
        this.FanShu = num;
    },
    // 创建
    onFixCreClick() {
        cc.log(`确定创建房间`);
        cc.log(`局数：${this.JuShu}, 番数：${this.FanShu}`);
        this.WanFa.forEach((item) => {
            cc.log(`玩法：${item}`);
        });

        var roomConfig = {};
        roomConfig.rounds = this.JuShu;
        roomConfig.basicraise = this.FanShu;
        roomConfig.playrule = this.WanFa;
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CREATE_ROOM_REP,roomConfig);
        //todo  暂时这样写
        // cc.dd.Reload.loadDir("DirRes", () => {
        //     cc.dd.sceneMgr.runScene(cc.dd.sceneID.GAME_SCENE);
        // });
    },
    // 关闭
    onCloseClick() {
        this.node.destroy();
    },
});
