cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.JuShu = 16;
        this.FanShu = 1;
        this.WanFa = [];
    },
    // 局数
    onJuShuClick(event, custom) {
        const num = parseInt(custom);
        this.JuShu = num;
    },
    // 玩法
    onWanFaClick(event, custom) {
        const item = cc.dd.hall_config.CYMJ_WF[custom];
        if (event.isChecked) {
            this.WanFa.push(item);
        } else {
            this.WanFa.forEach((items, index) => {
                if (item == items) {
                    this.WanFa.splice(index, 1);
                }
            });
        }
    },
    // 底番
    onDiFanClick(event, custom) {
        const num = parseInt(custom);
        this.FanShu = num;
    },
    // 创建
    onFixCreClick() {
        cc.log(`确定创建房间`);
        cc.log(`局数：${this.JuShu}, 番数：${this.FanShu}`);
        this.WanFa.forEach((item) => {
            cc.log(`玩法：${item}`);
        });
        //todo  暂时这样写
        cc.dd.Reload.loadDir("DirRes", () => {
            cc.dd.sceneMgr.runScene(cc.dd.sceneID.GAME_SCENE);
        });
    },
    // 关闭
    onCloseClick() {
        this.node.destroy();
    },
});
