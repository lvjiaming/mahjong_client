cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        cc.dd.appUtil.setScreenFit(this.node);
        cc.dd.roomEvent.addObserver(this);
        cc.dd.userEvent.addObserver(this);
        cc.dd.net.addObserver(this);
        this.setUserInfo();
    },
    onDestroy() {
        cc.dd.roomEvent.removeObserver(this);
        cc.dd.userEvent.removeObserver(this);
        cc.dd.net.removeObserver(this);
    },
    // 设置用户信息
    setUserInfo() {
        this.setUserId(cc.dd.user.getUserInfo().UID);
        this.setUserNickName(cc.dd.user.getUserInfo().nickname);
        this.setFangKaNum(cc.dd.user.getUserInfo().roomcardnum);
    },
    // 设置用户的id
    setUserId(id) {

    },
    // 设置昵称
    setUserNickName(nickName) {

    },
    // 设置房卡数目
    setFangKaNum(num) {

    },

    onMessageEvent(event, data) {
        switch (event) {
            case cc.dd.gameCfg.EVENT.EVENT_GAME_STATE: {
                cc.dd.Reload.loadDir("DirRes", () => {
                    cc.dd.sceneMgr.runScene(cc.dd.sceneID.GAME_SCENE);
                });
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },
});
