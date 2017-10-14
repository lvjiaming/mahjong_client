cc.Class({
    extends: cc.Component,

    properties: {
        NickNameLabel: {
            default:null,
            type: cc.Label,
        },
        PlayerId: {
            default:null,
            type: cc.Label,
        },
        RoomCard: {
            default:null,
            type: cc.Label,
        },
        avatar: {
            default:null,
            type: cc.Sprite,
        },
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
        cc.log("设置用户信息");
        this.setUserId(cc.dd.user.getUserInfo().UID);
        this.setUserNickName(cc.dd.user.getUserInfo().nickname);
        this.setFangKaNum(cc.dd.user.getUserInfo().roomcardnum);
        // this.setAvatarSpriteFrame(cc.dd.user.getUserInfo().wx_portrait);//跨域了，先注释掉
    },
    // 设置用户的id
    setUserId(id) {
        this.PlayerId.string = id;
    },
    // 设置昵称
    setUserNickName(nickName) {
        this.NickNameLabel.string = nickName;
    },
    // 设置房卡数目
    setFangKaNum(num) {
        this.RoomCard.string = num;
    },
    setAvatarSpriteFrame(sfurl) {
        var self = this;
        cc.loader.load("http://wx.qlogo.cn/mmopen/vi_32/OFpicnz436LIG7e2BPAoByaibwBOEwdITGJ5IzbAYsicJfM1kPjoyyEibShVicOgRCQZqzucfuEhmGYIkicEcmmsxShw/0", function(err, texture){
            if (err){
                cc.log("头像下载错误： " + err);
            }else {
                self.avatar.spriteFrame = new cc.SpriteFrame(texture);

            }
        });
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
