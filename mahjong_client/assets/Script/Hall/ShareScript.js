cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },
    onshareToFriendClick() {
    	cc.log("分享到朋友");
        jsb.reflection.callStaticMethod("WXShareTool", "jsInitiateWXFriendsShare");
    },
    onshareToQuanClick() {
    	cc.log("分享到票圈");
        jsb.reflection.callStaticMethod("WXShareTool", "jsInitiateWXMomentssShare");
    },
    onCloseClick() {
        this.node.destroy();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

});
