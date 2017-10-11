/*
 游戏内的配置
 */

module.exports = {
    // 牌的花色
    CARD_SUIT: {
        WAN: 1,  // 万
        TONG: 2, // 桶
        TIAO: 3, // 条
        OHTER: 4, // 其他，比如东南西北..
    },
    // 玩家的本地座位
    PLAYER_SEAT_LOCAL: {
        BOTTOM: 1,
        RIGHT: 2,
        TOP: 3,
        LEFT: 4,
    },
    // 消息枚举
    EVENT: {
        EVENT_CHECK_LOGIN_REP: 1001, // 检测登录请求
        EVENT_CHECK_LOGIN_REQ: 5001, // 检测登录的返回
        EVENT_LOGIN_REP: 1002, // 登录的请求
        EVENT_LOGIN_REQ: 5002, // 登录的返回
        EVENT_CREATE_ROOM_REP: 1003, // 创建房间的请求
        EVENT_ENTER_ROOM_REP: 1004, // 加入房间的请求
        EVENT_ROOM_DATA: 4001,  // 房间数据

        // 消息枚举，你在下面添加，我在上面添加
    },
};
cc.dd.gameCfg = module.exports;