cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.keyboardInput = {
            showNode: [],
            homeNumber: []
        };
    },
    // 输入房间号
    onNumClick(event, custom) {
        cc.log(`输入的内容：${custom}`);
        this.keyboardInput.showNode[this.keyboardInput.homeNumber.length].getComponent(cc.Label).string = custom;
        this.keyboardInput.homeNumber.push(custom);
        this.monitorInputOver();
    },
    // 重输
    onReInputClick: function(refs){
        this.keyboardInput.homeNumber.splice(0,this.keyboardInput.homeNumber.length);
        for(var i = 0; i < this.keyboardInput.showNode.length; i++){
            this.keyboardInput.showNode[i].getComponent(cc.Label).string = "";
        }
    },
    // 删除
    onDeleteClick: function(refs){
        if (this.keyboardInput.homeNumber.length === 0) {
            cc.log(`已删完`);
            return;
        }
        this.keyboardInput.homeNumber.splice(this.keyboardInput.homeNumber.length-1,1);
        this.keyboardInput.showNode[this.keyboardInput.homeNumber.length].getComponent(cc.Label).string = "";
    },
    monitorInputOver: function(){    //   监测是否已输了6位，并显示房间号
        if(this.keyboardInput.homeNumber.length === 6){
            this.setKeyboardState(false);
            var password = '';
            for(var i = 0; i < this.keyboardInput.homeNumber.length; i++){
                password = password + this.keyboardInput.homeNumber[i];
                console.log("房间号：",this.keyboardInput.homeNumber[i]);
            }
        }
    },
    // 关闭按钮
    onCloseClick() {
        cc.log(`关闭`);
        this.node.destroy();
    },
});
