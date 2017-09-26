
const SoundManger = cc.Class({
    statics: {
        getInstance() {
            if (!this.soundManger) {
                this.soundManger = new SoundManger();
            }
            return this.soundManger;
        },
    },
    _musicVolume: null,
    _soundVolume: null,
    _bgm: null,
    _bgmUrl: null,
    ctor() {

    },
    /**
     *  初始化函数
     */
    init() {
        if (cc.sys.localStorage.getItem("musicVolume") === null) {
            this._musicVolume = 1;
            cc.sys.localStorage.setItem("musicVolume", this._musicVolume * 10);
        } else {
            this._musicVolume = parseInt(cc.sys.localStorage.getItem("musicVolume")) / 10;
        }
        if (cc.sys.localStorage.getItem("soundVolume") === null) {
            this._soundVolume = 1;
            cc.sys.localStorage.setItem("soundVolume", this._soundVolume * 10);
        } else {
            this._soundVolume = parseInt(cc.sys.localStorage.getItem("soundVolume")) / 10;
        }
    },
    /**
     *  设置音乐的音量
     * @param v 音量值
     */
    setMusicVolume(v) {
        this._musicVolume = v;
        cc.sys.localStorage.setItem("musicVolume", this._musicVolume * 10);
        if (this._bgm === null) {
            if (this._bgmUrl) {
                this._bgm = cc.audioEngine.play(cc.url.raw(this._bgmUrl), true, this._musicVolume);
            }
        } else {
            cc.audioEngine.setVolume(this._bgm, this._musicVolume);
        }
    },
    /**
     *  设置音效的音量
     * @param v 音效值
     */
    setSoundVolume(v) {
        this._soundVolume = v;
        cc.sys.localStorage.setItem("soundVolume", this._soundVolume * 10);
    },
    /**
     *  获取音乐的音量
     * @returns {null}
     */
    getMusicVoluem() {
        return this._musicVolume;
    },
    /**
     * 获取音效的音量
     * @returns {null}
     */
    getSoundVolume() {
        return this._soundVolume;
    },
    /**
     *  播放背景音乐
     * @param url 路径
     * @param loop 是否循环
     */
    playMusic(url, loop) {
        this._bgmUrl = url;
        if (this._musicVolume === 0) {
            return;
        }
        this._bgm = cc.audioEngine.play(cc.url.raw(url), loop, this._musicVolume);
    },
    /**
     *  播放音效
     * @param url 路径
     */
    playSound(url) {
        if (this._soundVolume === 0) {
            return;
        }
        cc.audioEngine.play(cc.url.raw(url), false, this._soundVolume);
    },
});
cc.dd.soundMgr = SoundManger.getInstance();