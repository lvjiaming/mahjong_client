cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: {
            default: null,
            type: cc.ProgressBar,
            tooltip: "滑动条",
        },
        sliders: {
            default: null,
            type: cc.Slider,
            tooltip: "滑块",
        },
    },

    // use this for initialization
    onLoad: function () {
        this.progressBar.progress = this.sliders.progress;
    },
    /**
     *  滑动条的滑动事件
     */
    onSliderClick(event) {
        if (this.progressBar) {
            this.progressBar.progress = event.progress;
        }
    },
});
