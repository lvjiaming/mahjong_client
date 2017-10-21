cc.Class({
    extends: cc.Component,

    properties: {
        NoteLabel: {
            default: null,
            type: cc.Label,
            tooltip: "显示内容",
        },
        Ani: {
            default: null,
            type: cc.Animation,
            tooltip: "筛子动画",
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    onEnable() {
        this.Ani.play();
    },
    onDisable() {
        this.Ani.stop();
    },
    /**
     *  初始化内容
     * @param note 显示内容
     */
    initNote(note) {
        if (note) {
            this.NoteLabel.string = note;
        }
    },
});
