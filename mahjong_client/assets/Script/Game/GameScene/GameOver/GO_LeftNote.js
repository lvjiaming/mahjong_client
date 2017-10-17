cc.Class({
    extends: cc.Component,

    properties: {
        NickNameLabel: {
            default: null,
            type: cc.Label,
            tooltip: "昵称",
        },
        SocreLabel: {
            default: null,
            type: cc.Label,
            tooltip: "分数",
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     *  初始化内容
     */
    initNote(data) {
        if (this.NickNameLabel) {
            this.NickNameLabel.string = data.nickname;
        }
        if (this.SocreLabel) {
            this.SocreLabel.string = data.roomscore;
        }
    },
});
