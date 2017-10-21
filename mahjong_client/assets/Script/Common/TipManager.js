
const TipManager = cc.Class({
    statics: {
        getInstance() {
            if (!this.tips) {
                this.tips = new TipManager();
            }
            return this.tips;
        },
    },
    _ownNode: null, // 添加的节点(每个场景只传一次就行)
    _tipNode: null, // tip的节点
    /**
     *  构造函数
     */
    ctor() {
        this._ownNode = null;
        this._tipNode = null;
    },
    /**
     *  初始化
     * @param target 需要添加节点的父节点(每个场景只初始化一次)
     */
    init(target) {
        this._ownNode = target;
    },
    /**
     *  显示tips
     * @param note 显示内容
     * @param time 时间（可不传，传了在指定时间内自动关闭）
     */
    show(note, time) {
        if (!this._ownNode) {
            cc.log(`未初始化!!`);
            return;
        }
        let tipNode = this._ownNode.getChildByName("Tips");
        if (tipNode) {
            tipNode.active = true;
            tipNode.getComponent("Tips").initNote(note);
        } else {
            cc.dd.Reload.loadPrefab("Common/Prefab/Tips", (prefab) => {
                tipNode = cc.instantiate(prefab);
                tipNode.getComponent("Tips").initNote(note);
                this._ownNode.addChild(tipNode);
            });
        }
        if (time) {
            setTimeout(() => {
                this.hide();
            }, time);
        }
     },
    /**
     *  关闭
     */
    hide() {
        if (this._tipNode) {
            this._tipNode.destroy();
            this._tipNode = null;
        }
    },

});
cc.dd.tipMgr = TipManager.getInstance();