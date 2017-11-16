cc.Class({
    extends: cc.Component,

    properties: {
        chikaBtn: {
            default: null,
            type: cc.Node,
        },
        baoshiBtn: {
            default: null,
            type: cc.Node,
        },
        rightNode: {
            default: null,
            type: cc.Node,
        },
        didClickChika:null,
        didClickBSka:null,
    },

    // use this for initialization
    onLoad: function () {
        this.didClickChika = true;
        this.didClickBSka = false;
    },
    // 次卡点击
    onCilckChiKa() {
        cc.log("次卡点击");
        this.didClickBSka = false;
        if(!this.didClickChika){
            this.didClickChika = true;
            this.chikaBtn.getChildByName("tab").active = true;
            this.baoshiBtn.getChildByName("tab").active = false;
            this.rightNode.getChildByName("NoteBk").active = true;
            this.rightNode.getChildByName("NoteBk2").active = false;
        }
    },
    // 包时卡点击
    onClickBaoShiKa() {
        cc.log("包时卡点击");
        this.didClickChika = false;
        if(!this.didClickBSka){
            this.didClickBSka = true;
            this.chikaBtn.getChildByName("tab").active = false;
            this.baoshiBtn.getChildByName("tab").active = true;
            this.rightNode.getChildByName("NoteBk").active = false;
            this.rightNode.getChildByName("NoteBk2").active = true;
        }

    },
    // 关闭的事件，x按钮
    onCloseClick() {
        this.node.destroy();
    },

});
