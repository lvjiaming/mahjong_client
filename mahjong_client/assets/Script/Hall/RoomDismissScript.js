cc.Class({
    extends: cc.Component,

    properties: {
       agreeOnDismiss :{
            default: null,
            type: cc.Node,
            tooltip: "确认取消房间",
            // label: cc.node,
            // interactable: true, //这个属性为什么不能让按钮禁止
       },
    },

    // use this for initialization
    onLoad: function () {
        // 倒计时一分钟，一分钟后自动拒绝，如何能改到btn的label
        var tiktok = 0;
         cc.dd.getScheduler().schedule(function(){
            tiktok += 1;
         }, this, 1, tiktok >= 60);
    },
    onRejectClick() {
        cc.log("拒绝取消房间");
        // this.agreeOnDismiss.interactable = false;
        // this.agreeOnDismiss.label.string = "30";
        this.node.destory();
    },
    onConfrimClick() {
        //转菊花
        //网络请求
        cc.log("确认取消房间");
        //报错 this.node.destory is not a function
        // this.node.destroy();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
