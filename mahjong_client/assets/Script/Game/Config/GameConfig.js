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
};
cc.dd.gameCfg = module.exports;