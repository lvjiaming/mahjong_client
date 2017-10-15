cc.Class({
    extends: cc.Component,

    properties: {
        NumLabel: {
            default: null,
            type: cc.Node,
            tooltip: "显示输入的节点",
        },
    },

    // use this for initialization
    onLoad: function () {
        this.CanInPut = true;
        this.keyboardInput = {
            showNode: [],
            homeNumber: []
        };
        for (let i = 0; i < 6; i++) {
            let str = "Label" + (i + 1);
            this.keyboardInput.showNode.push(this.NumLabel.getChildByName(str));
        }
    },
    // 输入房间号
    onNumClick(event, custom) {
        if (!this.CanInPut) {
            cc.log(`已输完`);
            return;
        }
        cc.log(`输入的内容：${custom}`);
        this.keyboardInput.showNode[this.keyboardInput.homeNumber.length].getComponent(cc.Label).string = custom;
        this.keyboardInput.homeNumber.push(custom);
        this.monitorInputOver();
    },
    // 重输
    onReInputClick: function(refs){
        this.CanInPut = true;
        this.keyboardInput.homeNumber.splice(0,this.keyboardInput.homeNumber.length);
        for(var i = 0; i < this.keyboardInput.showNode.length; i++){
            this.keyboardInput.showNode[i].getComponent(cc.Label).string = "";
        }
    },
    // 删除
    onDeleteClick: function(refs){
        this.CanInPut = true;
        if (this.keyboardInput.homeNumber.length === 0) {
            cc.log(`已删完`);
            return;
        }
        this.keyboardInput.homeNumber.splice(this.keyboardInput.homeNumber.length-1,1);
        this.keyboardInput.showNode[this.keyboardInput.homeNumber.length].getComponent(cc.Label).string = "";
    },
    monitorInputOver: function(){    //   监测是否已输了6位，并显示房间号
        if(this.keyboardInput.homeNumber.length === 6){
            this.CanInPut = false;
            var password = '';
            for(var i = 0; i < this.keyboardInput.homeNumber.length; i++){
                password = password + this.keyboardInput.homeNumber[i];
                console.log("房间号：",this.keyboardInput.homeNumber[i]);
            }
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_ENTER_ROOM_REP, password);
        }//parseInt(password)
    },
    // 关闭按钮
    onCloseClick() {
        cc.log(`关闭`);
        this.node.destroy();
    },
});
