cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },

    onMessageEvent(event, data) {
        switch (event) {
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },
});
