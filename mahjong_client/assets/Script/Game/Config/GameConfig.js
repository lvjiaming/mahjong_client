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
    // 操作的类型
    OPERATE_TYPE: {
        PENG: 1,
        GANG: 2,
        CHI: 3,
    },
    // 胡牌的类型
    HU_TYPE: {
        ZI_MO: 1, // 自摸
        DIAN_PAO_HU: 2, // 点炮胡
        SI_HUI_HU: 3, // 四会儿胡
        DUI_BAO_HU: 4, // 对宝儿胡
        LOU_BAO_HU: 5, // 楼宝儿胡
        GANG_SHANG_HUA: 6, // 杠上花
    },
    // 房间玩法
    PLAY_OPERA: {
        KE_DUAN_MEN: 1,  // 可断门
        BI_MEN_HU: 2, // 闭门胡
        HUI_PAI: 3, // 会牌
        LOU_BAO: 4, // 楼宝
        JIA_HU: 5, // 夹胡
        DIAN_PAO_BAO_SAN_JIA: 5, // 点炮包三家
    },
    // 消息枚举
    EVENT: {
        EVENT_CHECK_LOGIN_REP: 1001, // 检测登录请求
        EVENT_CHECK_LOGIN_REQ: 5001, // 检测登录的返回
        EVENT_LOGIN_REP: 1002, // 登录的请求
        EVENT_LOGIN_REQ: 5002, // 登录的返回
        EVENT_LOGOUT_REP: 1013,// 登出的请求
        EVENT_LOGOUT_REQ: 5013,// 登出的返回
        EVENT_CREATE_ROOM_REP: 1003, // 创建房间的请求
        EVENT_ROOM_DATA: 4001,  // 房间数据
        EVENT_ENTER_ROOM_REP: 1004, // 加入房间的请求
        EVENT_GAME_STATE: 4002, // 房间的状态
        EVENT_ENTER_CARDCHANGE_REP: 1007, // 查询房卡数量
        EVENT_ENTER_CARDCHANGE_REQ: 5007, // 查询房卡数量的返回
        EVENT_CARDCHANGE_REP: 1008, // 转让房卡
        EVENT_CARDCHANGE_REQ: 5008, // 转让房卡返回
        EVENT_QUERY_GAMERECORD_REP: 1006,// 查询用户战绩
        EVENT_QUERY_GAMERECORD_REQ: 5006,// 查询用户战绩的返回
        EVENT_ROOM_DISMISS_REQUEST: 1009, // 申请解散房间
        EVENT_ROOM_DISMISS_AGREE: 1010, // 同意解散房间
        EVENT_ROOM_DISMISS_DISAGREE: 1011, // 不同意解散房间
        EVENT_ROOM_DISMISS_ANOUNCE: 4003, // 解散房间申请广播
        EVENT_ROOM_DISMISS_STATE: 4004, // 解散状态广播
        EVENT_ROOM_DISMISS_RESULT: 4008, //解散结果广播
        EVENT_OUTCARD_REP: 2001, // 出牌的请求
        EVENT_OUTCARD_RAD: 4011, // 出牌成功的广播
        EVENT_CHICARD_REP: 2003, // 吃牌的请求
        EVENT_CHICARD_RAD: 4013, // 吃牌成功的广播
        EVENT_PENGCARD_REP: 2004, // 碰牌的请求
        EVENT_PENGCARD_RAD: 4014, // 碰牌成功的广播
        EVENT_GANGCARD_REP: 2005, // 杠牌的请求
        EVENT_GANGCARD_RAD: 4015, // 杠牌成功的广播
        EVENT_HUCARD_REP: 2006, // 胡牌的请求
        EVENT_HUCARD_RAD: 4016, // 胡牌成功的广播
        EVENT_MOCARD_RAB: 4012, // 摸牌的广播
        EVENT_GUOCARD_REP: 2002, // 过牌的请求
        EVENT_TIMER_SPRCIEL: 4010, // 指针转动
        EVENT_ONE_GAME_OVER: 4017, // 结算
        EVENT_PLAYER_TING_CARD: 4022, // 玩家听牌
        EVENT_BAO_CARD_CHANGE: 4021,  // 宝牌更换

        // 消息枚举，你在下面添加，我在上面添加
        EVENT_DELEGATE_ROOM_REOCRD_REP: 1015, // 代理用户查询自己代开房间的记录
        EVENT_DELEGATE_ROOM_REOCRD_REQ: 5015, // 代理用户查询自己代开房间的记录的返回


    },
    // 电池电量状态
    BATTERTY: {
        BATTERTY_FULL_FIFTH: "battery_full", // 满格五格
        BATTERTY_FOURTH: "battery_four_bar", // 四格
        BATTERTY_THRID: "battery_three_bar",
        BATTERTY_SECOND: "battery_two_bar",
        BATTERTY_LOW: "battery_one_bar",    // 一格低电量
        BATTERTY_CHARGING: "battery_charging",  // 充电中
        BATTERTY_UNPULG: "battery_unpulg",  // 充电线拔出
    },
};
cc.dd.gameCfg = module.exports;