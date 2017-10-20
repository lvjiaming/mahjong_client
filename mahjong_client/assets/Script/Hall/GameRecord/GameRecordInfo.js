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
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     *  初始化单个信息
     * @param data
     */
    initInfo(data) {
        cc.log(`初始化单个信息`);
        this.RoomID.string = data.roomid;
        this.GameDate.string = data.time;
        this.NicknameOne.string =data.nickname1;
        this.NicknameOnePoint.string = data.score1;
        this.NicknameTwo.string =data.nickname2;
        this.NicknameTwoPoint.string = data.score2;
        this.NicknameThree.string =data.nickname3;
        this.NicknameThreePoint.string = data.score3;
        this.NicknameFour.string =data.nickname4;
        this.NicknameFourPoint.string = data.score4;
    },
});
