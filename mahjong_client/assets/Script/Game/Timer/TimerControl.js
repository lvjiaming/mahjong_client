const TIMER_NAME = [
    null,
    "Buttom",
    "Right",
    "Top",
    "Left",
];
cc.Class({
    extends: cc.Component,

    properties: {
        _preTimer: null,
    },

    // use this for initialization
    onLoad: function () {

    },
    // 转动
    ratateTimer(localSeat) {
        const timer = this.node.getChildByName(TIMER_NAME[localSeat]);
        if (timer) {
            if (this._preTimer) {
                this._preTimer.active = false;
            }
            timer.active = true;
            this._preTimer = timer;
        }
    },
});
