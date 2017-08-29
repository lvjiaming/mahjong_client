/**
 * Created by Administrator on 2017/8/29.
 */
/**
 *  观察者类
 * @type {Function}
 */
const EventManager = cc.Class({
    observerList: null, // 观察者列表
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
        if (target) {
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
});
