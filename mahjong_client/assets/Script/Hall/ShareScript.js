cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },
    onshareToFriendClick() {
    	cc.log("分享到朋友");
        cc.dd.invokeWXFriendShareCustumLink();
    },
    onshareToQuanClick() {
    	cc.log("分享到票圈");
        cc.dd.invokeWXMomentShareCustumLink();
    },
    onCloseClick() {
        this.node.destroy();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

});
