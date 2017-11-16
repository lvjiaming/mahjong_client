
module.exports = {
    // 朝阳麻将玩法配置
    CYMJ_WF: {
        CAN_DUANMEN: 1,  // 可断门
        BIMEN_HU: 2,  // 闭门胡
        HUI: 3, // 会
        LOU_BAO: 4, // 喽宝
        JIA_HU: 5, // 夹胡
        DIANPAO_BAOSANJIA: 6,// 点炮包三家
        QING_YI_SE: 7, // 清一色
    },
    EXC_CARD_TYPE: {
        EXC_CHIKA: "roomcard",
        EXC_DAYKA: "daycard",
        EXC_WEEKKA: "weekcard",
        EXC_MOUTHKA: "monthcard",
    },
    EXC_BAOSHIKA_TABNUM: {
        BAOSHIKA_DAY: "天卡",
        BAOSHIKA_WEEK: "小王卡",
        BAOSHIKA_MOUTH: "大王卡",
    },
};
cc.dd.hall_config = module.exports;