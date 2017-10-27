cc.Class({
    extends: cc.Component,

    properties: {
        RoomID: {
            default: null,
            type: cc.Label,
            tooltip: "房间号",
        },
        GameDate: {
            default: null,
            type: cc.Label,
            tooltip: "对战时间",
        },
        NicknameOne: {
            default: null,
            type: cc.Label,
            tooltip: "一号玩家昵称",
        },
        NicknameOnePoint: {
            default: null,
            type: cc.Label,
            tooltip: "一号玩家得分",
        },
        NicknameTwo: {
            default: null,
            type: cc.Label,
            tooltip: "二号玩家昵称",
        },
        NicknameTwoPoint: {
            default: null,
            type: cc.Label,
            tooltip: "二号玩家得分",
        },
        NicknameThree: {
            default: null,
            type: cc.Label,
            tooltip: "三号玩家昵称",
        },
        NicknameThreePoint: {
            default: null,
            type: cc.Label,
            tooltip: "三号玩家得分",
        },
        NicknameFour: {
            default: null,
            type: cc.Label,
            tooltip: "四号玩家昵称",
        },
        NicknameFourPoint: {
            default: null,
            type: cc.Label,
            tooltip: "四号玩家得分",
        },
        AvatarOne: {
            default: null,
            type: cc.Sprite,
            tooltip: "一号头像",
        },
        AvatarTwo: {
            default: null,
            type: cc.Sprite,
            tooltip: "二号头像",
        },
        AvatarThree: {
            default: null,
            type: cc.Sprite,
            tooltip: "三号头像",
        },
        AvatarFour: {
            default: null,
            type: cc.Sprite,
            tooltip: "四号头像",
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     *  初始化单个信息
     * @param data
     */
    initInfo(data) {
        // cc.log(`初始化单个信息`);
        this.RoomID.string = "房间号: " + data.roomid;
        this.GameDate.string = "对战时间: " + data.time;
        this.NicknameOne.string =data.nickname1;
        this.NicknameOnePoint.string = data.score1;
        this.NicknameTwo.string =data.nickname2;
        this.NicknameTwoPoint.string = data.score2;
        this.NicknameThree.string =data.nickname3;
        this.NicknameThreePoint.string = data.score3;
        this.NicknameFour.string =data.nickname4;
        this.NicknameFourPoint.string = data.score4;
        var target01 = this.AvatarOne;
        cc.dd.setPlayerHead(data.wx_portrait1,target01);
        var target02 = this.AvatarTwo;
        cc.dd.setPlayerHead(data.wx_portrait2,target02);
        var target03 = this.AvatarThree;
        cc.dd.setPlayerHead(data.wx_portrait3,target03);
        var target04 = this.AvatarFour;
        cc.dd.setPlayerHead(data.wx_portrait4,target04);
    },
});
