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

// 接受
cc.WXLoginCallBack = (code) => {
    cc.log(`返回的值${code}`);
};