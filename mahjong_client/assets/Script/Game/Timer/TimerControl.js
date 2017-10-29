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
        TimeLabel: {
            default: null,
            type: cc.Label,
            tooltip: "时间显示",
        },
        showTimeLayout: {
            default: null,
            type: cc.Node,
            tooltip: "时间显示",
        },
        _time: null,
    },

    // use this for initialization
    onLoad: function () {

    },
    // 转动
    ratateTimer(localSeat) {
        this.unscheduleAllCallbacks();
        this._time = 15;
        this.timing();
        const timer = this.node.getChildByName(TIMER_NAME[localSeat]);
        if (timer) {
            if (this._preTimer) {
                this._preTimer.active = false;
            }
            timer.active = true;
            this._preTimer = timer;
        }
    },
    timing() {
        // if (this.TimeLabel) {
        //     this.TimeLabel.string = this._time;
        //     this.scheduleOnce(this.timingFun.bind(this), 1.0);
        // }
        if(this.showTimeLayout) {
            this.showTimeLayout.removeAllChildren();
            cc.dd.Reload.loadAtlas("Game/Atlas/timer", (atlas) => {
                cc.dd.Reload.loadPrefab("Game/Prefab/ShowTime", (prefab) => {
                    const timestr = cc.instantiate(prefab);
                    timestr.getComponent("composeNum").initNum(this._time,atlas);
                    this.showTimeLayout.addChild(timestr);
                });
            });
            this.scheduleOnce(this.timingFun.bind(this), 1.0);
        }
    },
    timingFun() {
        if (this._time) {
            this._time--;
            this.timing();
        }
    },
});
