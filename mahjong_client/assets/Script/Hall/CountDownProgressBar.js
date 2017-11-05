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
        if(data.denys > 0) {
            var imgReject = cc.url.raw("Hall/Atlas/dismiss-ty@2x.png");
            var rejectTexture = cc.textureCache.addImage(imgReject);
            if(data.denys == 1){
                this.secondBar.spriteFrame.setTexture(rejectTexture);
            }else if(data.denys == 2){
                this.secondBar.spriteFrame.setTexture(rejectTexture);
                this.thridBar.spriteFrame.setTexture(rejectTexture);
            }else {
                this.secondBar.spriteFrame.setTexture(rejectTexture);
                this.thridBar.spriteFrame.setTexture(rejectTexture);
                this.fourthBar.spriteFrame.setTexture(rejectTexture);
            }
        }
    },

});
