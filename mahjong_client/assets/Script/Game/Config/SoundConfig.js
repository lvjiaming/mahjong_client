/**
 * Created by Administrator on 2017/10/19.
 */
const SUIT = [
    null,
    "wan",
    "tong",
    "tiao",
    "zi"
];
const SOUND_NAME = {
    V_CHI: "dgame_chi",
    V_PENG: "dgame_peng",
    V_GANG: "dgame_gang",
    V_HU: "dgame_hu",
    V_TING: "ting",
};
cc.dd.soundName = SOUND_NAME;
const SoundConfig = {
    MAN: "resources/Game/Sound/man/",
    WOMAN: "resources/Game/Sound/woman/",
    COMMON:"resources/Game/Sound/common/",
};
/**
 *  获取男声（两个参数同事传，默认为牌的音效，只传一个，怎默认为传的名字）
 * @param num
 * @param suit
 */
SoundConfig.getManSound = (num, suit) => {
    let str = "";
    if (num && suit) {
        str = "dgame_" + num + "_" +SUIT[suit] + ".mp3";
    }
    if (num && !suit) {
        str = num + ".mp3";
    }
    return SoundConfig.MAN + str;
};
/**
 *  获取女声（两个参数同事传，默认为牌的音效，只传一个，怎默认为传的名字）
 * @param num
 * @param suit
 */
SoundConfig.getWoManSound = (num, suit) => {
    let str = "";
    if (num && suit) {
        str = "dgame_" + num + SUIT[suit] + ".mp3";
    }
    if (num && !suit) {
        str = num + ".mp3";
    }
    return SoundConfig.WOMAN + str;
};
/**
 *  播放音效的公用方法
 * @param xb 性别
 * @param v_1
 * @param v_2
 */
cc.dd.playEffect = (xb, v_1, v_2) => {
    if (xb == 1) {
        cc.log(`音效路径为：${SoundConfig.getManSound(v_1, v_2)}`);
        cc.dd.soundMgr.playSound(SoundConfig.getManSound(v_1, v_2));
    } else {
        cc.dd.soundMgr.playSound(SoundConfig.getWoManSound(v_1, v_2));
    }
};