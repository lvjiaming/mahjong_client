/**
 * Created by Administrator on 2017/9/13.
 *  场景管理器
 */
const SceneID = {
    LOGIN_SCENE: 1,
    HALL_SCENE: 2,
    GAME_SCENE: 3,
};
const SceneManager = cc.Class({
    statics: {
        getInstance() {
            if (!this.sceneMgr) {
                this.sceneMgr = new SceneManager();
            }
            return this.sceneMgr;
        },
    },
    /**
     * @function addPersistRootNode
     * @description 设置节点为常驻节点
     * @param node
     */
    addPersistRootNode:function (node) {
        cc.game.addPersistRootNode(node);
    },

    /**
     * @function removePersistRootNode
     * @description 移除常驻节点
     * @param node
     */
    removePersistRootNode:function(node){
        cc.game.removePersistRootNode(node);
    },
    /**
     * 运行指定场景
     * @param sceneId 场景id
     * @param data 需要的数据
     * @param callback 回调
     */
    runScene(sceneId, data, callback) {
        switch (sceneId) {
            case SceneID.LOGIN_SCENE: {
                this._loadScene("Login_Scene.fire", sceneId, data, callback);
                break;
            }
            case SceneID.HALL_SCENE: {
                this._loadScene("Hall_Scene.fire", sceneId, data, callback);
                break;
            }
            case SceneID.GAME_SCENE: {
                this._loadScene("Mahjong_GmaeScene.fire", sceneId, data, callback);
                break;
            }
            default: {
                cc.log(`未知的场景id`);
                break;
            }
        }
    },
    /**
     *  具体的跳转场景
     * @param sceneName 场景名字
     * @param sceneId 场景id
     * @param data 需要的数据
     * @param callback 回调
     * @private
     */
    _loadScene(sceneName, sceneId, data, callback) {
        cc.director.preloadScene(sceneName, () => {
            cc.director.loadScene(sceneName, () => {
                cc.director.getScene().sceneId = sceneId;
                cc.director.getScene().data = data;
                if (callback instanceof Function) {
                    callback();
                }
            });
        });
    },
});
cc.dd.sceneMgr = SceneManager.getInstance();
cc.dd.sceneID = SceneID;