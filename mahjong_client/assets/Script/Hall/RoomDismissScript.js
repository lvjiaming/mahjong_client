cc.Class({
    extends: cc.Component,

    properties: {
       agreeOnDismiss :{
            default: null,
            type: cc.Button,
            tooltip: "确认取消房间",
       },
    },

    // use this for initialization
    onLoad: function () {
        // 倒计时一分钟，一分钟后自动拒绝，如何能改到btn的label
         // cc.dd.getScheduler().schedule(function(){

         //    tiktok += 1;
         //    cc.log(this.agreeOnDismiss);
         //    if (tiktok == 60) {

         //    }
         // }, this, 1, tiktok > 60);
        this.count = 60;
        this.callback = function () {
            if (this.count === 0) {
                // 在第六十次执行回调时取消这个计时器
                this.unschedule(this.callback);
            }
            this.agreeOnDismiss.getComponent(cc.Label).String = this.count.toString();
            this.count++;
        }
        this.agreeOnDismiss.schedule(this.callback, 1);
    },
    onRejectClick() {
        cc.log("拒绝取消房间");
        //取消定时器
        this.unschedule(this.callback);
        this.node.destroy();
    },
    onConfrimClick() {
        //转菊花
        //网络请求
        cc.log("确认取消房间");
        this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
