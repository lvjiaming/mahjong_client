cc.Class({
    extends: cc.Component,

    properties: {
        musicSlider: {
            default: null,
            type: cc.Slider,
            tooltip: "音乐的控制",
        },
        soundSlider: {
            default: null,
            type: cc.Slider,
            tooltip: "音效的控制",
        },
        logoutButton: {
            default: null,
            type: cc.Button,
            tooltip: "退出登录",
        }
    },

    // use this for initialization
    onLoad: function () {
        if (this.musicSlider) {
            this.musicSlider.progress = cc.dd.soundMgr.getMusicVoluem();
        }
        if (this.soundSlider) {
            this.soundSlider.progress = cc.dd.soundMgr.getSoundVolume();
        }
    },

    onSliderClick(event, custom) {
        switch (parseInt(custom)) {
            case 1: {
                cc.dd.soundMgr.setMusicVolume(event.progress);
                break;
            }
            case 2: {
                cc.dd.soundMgr.setSoundVolume(event.progress);
                break;
            }
            default: {
                cc.log(`unkown custom: ${custom}`);
                break;
            }
        }
    },
    onCloseClick() {
        this.node.destroy();
    },
    onLogoutClick() {
        cc.log("退出微信登录");
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_LOGOUT_REP, "logout");
        this.node.destroy();
    },
});
