/**
 * Created by Administrator on 2017/10/18.
 */
// 发起

cc.dd.sendWXLogin = function () {
    cc.log(`发起微信登录请求`);
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity" ,"SendWXAuthReq", "()V");
    }
};
cc.dd.sendOCWXlogin = function () {
    cc.log("IOS发起微信登录");
    if (cc.sys.isNative) {
        jsb.reflection.callStaticMethod("RootViewController", "provokeWXLogin");
    }
};
cc.dd.sendGetAndroidDeviceId = function () {
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity" ,"getAndroidDeviceId", "()V");
    }
};

// 接受
cc.WXLoginCallBack = (code) => {  // 微信登录的code值
    cc.log(`返回的值${code}`);
    cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_LOGIN_REP, code);
};

// deviceId
cc.AndroidDeviceId = (id) => {
    cc.log(`返回的devideid = ${id}`);
    if (cc.dd.user.getUserDid()) {
        cc.log(`已存在did: ${cc.dd.user.getUserDid()}`);
    } else {
        cc.dd.user.setUserDid(id);
    }
};

/**
 *  公用的设置头像的方法
 * @param url 头像下载的地址
 * @param head 需要设置的头像的sprite组件
 */
cc.dd.setPlayerHead = (url, head) => {
    if (cc.sys.isNative) {
        const headUrl = cc.dd.pubConst.IMAGE_PREFIX_HOST + url;  // 此处写你拼接的url
        cc.loader.load(headUrl, (err, texture) => {
            if (err) {
                cc.error(err);
            } else {
                head.spriteFrame = new cc.SpriteFrame(texture);
            }
        });
    }
};
// app下载链接分享到朋友对话
cc.dd.invokeWXFriendShareCustumLink = () => {
    if(cc.sys.isMobile) {
        if (cc.sys.os == cc.sys.OS_ANDROID){

        }else {
            jsb.reflection.callStaticMethod("WXShareTool", "jsInitiateWXFriendsShare");
        }
    }
};
// app下载链接分享到朋友圈
cc.dd.invokeWXMomentShareCustumLink = () => {
    if(cc.sys.isMobile) {
        if (cc.sys.os == cc.sys.OS_ANDROID){

        }else {
            jsb.reflection.callStaticMethod("WXShareTool", "jsInitiateWXMomentssShare");
        }
    }
};
// 房间号，房间信息分享到朋友对话
cc.dd.invokeWXFriendShareCustumText = (str) => {
    if(cc.sys.isMobile) {
        if(cc.sys.os == cc.sys.OS_ANDROID) {

        }else {
            jsb.reflection.callStaticMethod("WXShareTool", "jsInitiateWXFriendsShare:",contentstr);
        }
    }
};