cc.Class({
    extends: cc.Component,

    properties: {
        BtnLogin: {
            default: null,
            type: cc.Node,
            tooltip: "登录的按钮",
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.dd.appUtil.setScreenFit(this.node);
        // cc.dd.net.connectNet("", () => {
        //     this.setBtnLoginState(true);
        // });
    },
    // 登录按钮
    onLoginClick() {
        cc.log(`用户登录`)
    },
    // 设置登录按钮的状态
    setBtnLoginState(state) {
        if (this.BtnLogin) {
            this.BtnLogin.active = state
        } else {
            cc.log(`节点未绑定`)
        }
    },
    onMessageEvent(event, data) {
        switch (event) {
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },
});
