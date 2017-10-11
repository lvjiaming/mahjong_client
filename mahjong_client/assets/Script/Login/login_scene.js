cc.Class({
    extends: cc.Component,

    properties: {
        BtnLogin: {
            default: null,
            type: cc.Node,
            tooltip: "登录的按钮",
        },
        CheckBox: {
            default: null,
            type: cc.Node,
            tooltip: "用户协议",
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.dd.appUtil.setScreenFit(this.node);
        cc.dd.soundMgr.init();
        cc.dd.userEvent.addObserver(this);
        cc.dd.net.addObserver(this);
        cc.dd.net.connectNet(cc.dd.pubConst.HOST_STR, () => {
            this.setBtnLoginState(true);
        });
    },
    onDestroy() {
        cc.dd.userEvent.removeObserver(this);
        cc.dd.net.removeObserver(this);
    },
    // 登录按钮
    onLoginClick() {
        cc.log(`用户登录`);
        // 请求登录
        // cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REP, {
        //     "command": cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REP,
        //     "did": "39d394f7-db13-4768-a4da-40e18273d7a8",
        //     "code": "6SDF4ASD4GFAS4FG5ASD5F5Dsdf"
        // });
        // cc.dd.sceneMgr.runScene(cc.dd.sceneID.HALL_SCENE);
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REP, "6SDF4ASD4GFAS4FG5ASD5F5Dsdf");
    },

    clickCheckBoxToggle(event, custom) {
        var temp = this.CheckBox.getComponent(cc.dd.CheckBox);
        cc.log(temp.isChecked);
        var tempbtn = this.BtnLogin.getComponent(cc.dd.BtnLogin);
        log(tempbtn.interactable);
        if (temp.isChecked) {
            cc.log(temp.isChecked);
            tempbtn.interactable = true;
        }else{
            tempbtn.interactable = false;
        }
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
            case cc.dd.userEvName.USER_LOGIN_SCU: {
                cc.log(`登录成功`);
                cc.dd.sceneMgr.runScene(cc.dd.sceneID.HALL_SCENE);
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },
});
