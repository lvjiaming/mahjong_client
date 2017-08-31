/*
 处理服务器返回的游戏里的数据
 */
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        cc.dd.roomEvent.addObserver(this);
        cc.dd.userEvent.addObserver(this);
    },
    onDestroy() {
        cc.dd.roomEvent.removeObserver(this);
        cc.dd.userEvent.removeObserver(this);
    },

    onMessageEvent(event, data) {
        switch (event) {
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },

});
