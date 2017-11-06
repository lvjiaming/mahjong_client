cc.Class({
    extends: cc.Component,

    properties: {
        countDownLabel: {
            default:null,
            type: cc.Label,
        },
        fristBar: {
            default:null,
            type: cc.Sprite,
        },
        secondBar: {
            default:null,
            type: cc.Sprite,
        },
        thridBar: {
            default:null,
            type: cc.Sprite,
        },
        fourthBar: {
            default:null,
            type: cc.Sprite,
        },
    },

    // use this for initialization
    onLoad: function () {
        // cc.dd.userEvent.addObserver(this); // 为什么观察者不调用这里，明明list为2
        // cc.dd.roomEvent.addObserver(this);
        cc.dd.user._countNum = 30;
        this.callback = function () {
            if (cc.dd.user._countNum === 1) {
                this.unschedule(this.callback);
            }
            cc.dd.user._countNum--;
            this.countDownLabel.string = "房间解散（" + cc.dd.user._countNum + "）";
        }
        this.schedule(this.callback, 1);
    },
    onDestroy() {
        this.unschedule(this.callback);
        // cc.dd.userEvent.removeObserver(this);
        // cc.dd.roomEvent.removeObserver(this);
    },
    updateBarStrike(data) {
        cc.log("收到4004");
        let rejectTexture = null;
        let accesttexture = null;
        if(data.denys > 0) {
            let imgReject = cc.url.raw("resources/Hall/Atlas/dismiss-ty@2x.png");
            rejectTexture = new cc.SpriteFrame(imgReject);
        }
        if(data.accepts >= 2) {
            let imgReject = cc.url.raw("resources/Hall/Atlas/dismiss-qr@2x.png");
            accesttexture = new cc.SpriteFrame(imgReject);
        }
        if(data.denys > 0 && data.accepts > 0) {
            if(data.denys === 1){
                this.secondBar.spriteFrame = rejectTexture;
                if(data.accepts == 2) {
                    this.thridBar.spriteFrame = accesttexture;
                }else if(data.accepts == 3) {
                    this.thridBar.spriteFrame = accesttexture;
                    this.fourthBar.spriteFrame = accesttexture;
                }
            }else if(data.denys == 2) {
                this.secondBar.spriteFrame = rejectTexture;
                this.thridBar.spriteFrame = rejectTexture;
                if(data.accepts == 2) {
                    this.fourthBar.spriteFrame = accesttexture;
                }
            }else if(data.denys == 3) {
                this.secondBar.spriteFrame = rejectTexture;
                this.thridBar.spriteFrame = rejectTexture;
                this.fourthBar.spriteFrame = rejectTexture;
            }
        }else if (data.denys === 0 && data.accepts > 1){
            if(data.accepts == 2) {
                this.secondBar.spriteFrame = accesttexture;
            }else if(data.accepts == 3) {
                this.secondBar.spriteFrame = accesttexture;
                this.thridBar.spriteFrame = accesttexture;
            }else if(data.accepts == 4) {
                this.secondBar.spriteFrame = accesttexture;
                this.thridBar.spriteFrame = accesttexture;
                this.fourthBar.spriteFrame = accesttexture;
            }
        }
    },

});
