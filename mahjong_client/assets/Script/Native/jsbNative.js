/**
 * Created by Administrator on 2017/10/18.
 */
// 发起

cc.dd.sendWXLogin = function () {
    cc.log(`发起微信登录请求`);
    if (cc.sys.isNative) {
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
    if (cc.sys.isNative) {
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