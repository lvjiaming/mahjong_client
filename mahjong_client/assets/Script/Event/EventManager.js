/**
 * Created by Administrator on 2017/8/29.
 */
/**
 *  观察者类
 * @type {Function}
 */
const EventManager = cc.Class({
    observerList: null, // 观察者列表
    msgList: null, // 消息列表
    _isCache: null, // 是否协议缓存
    _cacheList: null, // 协议缓存列表
    statics: {
        getInstance() {
            if (!this.eventManager) {
                this.eventManager = new EventManager()
            }
            return this.eventManager
        },
    },
    ctor() {
        this.observerList = [];
        this.msgList = [];
        this._isCache = false;
        this._cacheList = [];
    },

    /**
     *  添加观察者
     * @param target
     */
    addObserver(target) {
        this.observerList.forEach((item) => {
             if (item == target) {
                 return true
             }
        });
        if (target) {
            this.observerList.push(target);
        } else {
            cc.log("target is null");
        }
        cc.log("observerList.length = ", this.observerList.length);
    },

    /**
     *  移除观察者
     * @param target
     */
    removeObserver(target) {
        if (!target) {
            cc.log("target is null");
        } else {
            this.observerList.forEach((item, index) => {
                if (item == target) {
                    this.observerList.splice(index, 1);
                }
            });
        }
        cc.log("observerList.length = ", this.observerList.length);
    },

    /**
     *  时间发生变化,通知观察者
     */
    notifyEvent(event, data) {
        try {
            this.observerList.forEach((item) => {
                item.onMessageEvent(event, data);
            });
        } catch (err) {
            cc.error(err);
        }
    },
    /**
     *  添加消息列表
     * @param event 消息id
     * @param data 消息内容
     */
    addMsg(event, data) {
        const msg = {
            event: event,
            data: data,
        };
        this.msgList.push(msg);
    },
    /**
     *  下发存储的消息
     */
    notifyMsg() {
        this.msgList.forEach((item) => {
            cc.dd.roomEvent.notifyEvent(item.event, item.data);
        });
    },
    /**
     *  清空存储的消息列表
     */
    cleanMsgList() {
        this.msgList = [];
    },
    /**
     *  将消息加入协议缓存列表
     * @param event id
     * @param data 数据
     */
    addMsgToCacheList(event, data) {
        cc.log(`将协议缓存下来`);
        let body = {
            event: event,
            data: data,
        };
        this._cacheList.push(body);
    },
    /**
     *  q清空列表
     */
    cleanCacheList() {
        this._cacheList = [];
    },
    /**
     *  缓存的开关
     * @param state
     */
    setIsCache(state) {
        this._isCache = state;
    },
    /**
     *  下发缓存中的协议
     */
    notifyCacheList() {
        // this._cacheList.forEach((item, index) => {
        //     if (this._isCache) {
        //         setTimeout((item, ) => {
        //             cc.dd.roomEvent.notifyEvent(item.event, item.data);
        //         }, 1000);
        //     }
        // });
        // if(!this._isCache) {
        //     cc.log("执行缓存的开关");
        //     return;
        // }
        if (this._isCache && this._cacheList.length > 0) {
            const cacheMsg = this._cacheList[0];
            if(cc.dd.room.huing) {
                if(cacheMsg.event === 4018 || cacheMsg.event == "room_game_data") {
                    cc.log("还没到胡牌动画");
                    return;
                }
            }
            this._cacheList.splice(0, 1);
            cc.log(`下一条协议：${cacheMsg.event}`);
            cc.dd.roomEvent.notifyEvent(cacheMsg.event, cacheMsg.data);
        }
    },
});
