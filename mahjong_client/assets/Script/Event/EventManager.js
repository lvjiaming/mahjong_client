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
});
