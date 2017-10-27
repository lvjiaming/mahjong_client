cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },
    // 初始化
    initNum(time,atlas) {
        for(i = 0;i<time.toString().length;i++) {
            const str = "fjsz" + time.toString()[i] + "@2x";
            var node1 = new cc.Node('numstr1');
            var sp1 = node1.addComponent(cc.Sprite);
            sp1.spriteFrame = atlas.getSpriteFrame(str);
            this.node.addChild(node1);
        }
    },
    initPoint(ponit,atlas) {
        if(ponit.toString().indexOf("-") != -1) {
            for(i = 0;i<ponit.toString().length;i++) {
                if(i == 0) {
                    var node1 = new cc.Node('numstr1');
                    var sp1 = node1.addComponent(cc.Sprite);
                    sp1.spriteFrame = atlas.getSpriteFrame("jian");
                    this.node.addChild(node1);
                }else {
                    const str = "num_" + ponit.toString()[i];
                    var node1 = new cc.Node('numstr1');
                    var sp1 = node1.addComponent(cc.Sprite);
                    sp1.spriteFrame = atlas.getSpriteFrame(str);
                    this.node.addChild(node1);
                }

            }
        }else {
            if(ponit == 0){
                var node1 = new cc.Node('numstr1');
                var sp1 = node1.addComponent(cc.Sprite);
                sp1.spriteFrame = atlas.getSpriteFrame("num_0");
                this.node.addChild(node1);
            }else {
                var node1 = new cc.Node('numstr1');
                var sp1 = node1.addComponent(cc.Sprite);
                sp1.spriteFrame = atlas.getSpriteFrame("jia");
                this.node.addChild(node1);
                for(i = 0;i<ponit.toString().length;i++) {
                    const str = "num_" + ponit.toString()[i];
                    var node1 = new cc.Node('numstr1');
                    var sp1 = node1.addComponent(cc.Sprite);
                    sp1.spriteFrame = atlas.getSpriteFrame(str);
                    this.node.addChild(node1);
                }
            }
        }
    },
});
