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
        CreateRoom: {
            default: null,
            type: cc.Node,
            tooltip: "创建房间",
        },
        CreateDelegateRoom: {
            default: null,
            type: cc.Node,
            tooltip: "创建代开房间",
        },
        DelegateRoomRecord: {
            default: null,
            type: cc.Node,
            tooltip: "我的代开房间",
        },
    },

    // use this for initialization
    onLoad: function () {
        this.JuShu = 16;
        this.FanShu = 1;
        this.WanFa = [1];
        if (cc.dd.user.getUserInfo().isagent == 1) {
            cc.log("是代理了");
            this.DelegateRoomRecord.active = true;
        }
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
                this.WanFa.push(item);
                if (item == 3){
                    this.JiahuToggle.interactable = false;
                }
                if (item == 5){
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
        roomConfig.createtype = "selfuse";// agent  selfuse
        roomConfig.roomtype = "cymj";
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CREATE_ROOM_REP,roomConfig);
    },
    // 代理人代开房间给其他用户玩的功能
    onAgentRoomDelegateClick() {
        var roomConfig = {};
        roomConfig.rounds = this.JuShu;
        roomConfig.basicraise = this.FanShu;
        roomConfig.playrule = this.WanFa;
        roomConfig.createtype = "agent";// agent  selfuse
        roomConfig.roomtype = "cymj";
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CREATE_ROOM_REP,roomConfig);
        this.node.destroy();
    },
    // 我的代开房间
    onRoomDelegateRecords() {
        cc.log("我的代开房间");
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_DELEGATE_ROOM_REOCRD_REP);
        cc.dd.Reload.loadPrefab("Hall/Prefab/RoomDelegateRecord", (prefab) => {
            const gameRecord = cc.instantiate(prefab);
        gameRecord.getComponent("RoomDelegRecord").initInfo();
        cc.find("UI_ROOT").addChild(gameRecord);
        });
        this.node.destroy();
    },
    // 关闭
    onCloseClick() {
        this.node.destroy();
    },
    // 新建代理房间
    initDelgatedRoomCreSetting() {
        this.CreateRoom.active = false;
        this.CreateDelegateRoom.active = true;
    },
});
