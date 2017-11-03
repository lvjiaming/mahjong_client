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
    if (cc.sys.isMobile) {
        const headUrl = cc.dd.pubConst.IMAGE_PREFIX_HOST + url;  // 此处写你拼接的url
        cc.log(headUrl);
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
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity" ,"SendLinkUrl", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                "http://dafuvip.com/baaEJ3" ,
                "正宗朝阳北票建平凌源手机麻将",
                "好友随时约局，手机实时对战。搂宝带会儿、点炮赔三家。");
        }else {
            jsb.reflection.callStaticMethod("WXShareTool", "jsInitiateWXFriendsShare");
        }
    }
};
// app下载链接分享到朋友圈
cc.dd.invokeWXMomentShareCustumLink = () => {
    if(cc.sys.isMobile) {
        if (cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity" ,"ShareLinkTimeline", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                "http://dafuvip.com/baaEJ3",
                "正宗朝阳北票建平凌源手机麻将",
                "好友随时约局，手机实时对战。搂宝带会儿、点炮赔三家。");
        }else {
            jsb.reflection.callStaticMethod("WXShareTool", "jsInitiateWXMomentssShare");
        }
    }
};
// 房间号，房间信息分享到朋友对话
cc.dd.invokeWXFriendShareCustumText = (str, password) => {
    if(cc.sys.isMobile) {
        if(cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity" ,"SendWXAppContent", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                password ,
                "http://dafuvip.com/baaEJ3",
                str);
        }else {
            jsb.reflection.callStaticMethod("WXShareTool", "jsInitiateWXFriendsShare:",str);
        }
    }
};

// 获取电量
cc.dd.getCurrentBatteryStatus = () => {
    if(cc.sys.isMobile) {
        if(cc.sys.os == cc.sys.OS_ANDROID) {
            return 1;
        }else {
            var result = jsb.reflection.callStaticMethod("BatterMonitor","getBatteryLevel");
            cc.log("返回的电池电量"+result.toPrecision(2));
            return result.toPrecision(2);
        }
    }
};
// 获取正在充电与否的状态
cc.dd.getCurrentBatteryChargingStatus = () => {

    if(cc.sys.isMobile) {
        if(cc.sys.os == cc.sys.OS_ANDROID) {
            return false;
        }else {
            var stateResult = jsb.reflection.callStaticMethod("BatterMonitor","getBatteryState");
            cc.log("返回的充电状态"+ stateResult);
            if(stateResult == "Charging") {
                return true;
            }else {
                return false;
            }
        }
    }else {
        return true; // 网页调试
    }
};
// 被原生回调的更新电池电量的方法
// cc.dd.updateCurrentBatteryLevel = (level) => {
//     cc.log("oc观察者观察电量发生改变回调"+level);
//     // cc.dd.gameCfg.BATTERTY.BATTERTY_LEVEL_UPDATE
// };
// 被原生回调的更新电池是否在充电状态的方法
// cc.dd.updateCurrentBatteryStatus = (sta) => {
//     cc.log("oc");
//     // cc.log("oc观察者观察电量发生改变回调"+sta);
//     // if(sta == "Charging"){
//     //     cc.dd.notifyEvent(cc.dd.gameCfg.BATTERTY.BATTERTY_CHARGING,true);
//     // }else {
//     //     cc.dd.notifyEvent(cc.dd.gameCfg.BATTERTY.BATTERTY_CHARGING,false);
//     // }
// };
// 把房间id复制到手机剪贴板
cc.dd.accessPatseBoard = (str) => {
    if(cc.sys.isMobile) {
        if(cc.sys.os == cc.sys.OS_ANDROID) {

        }else {
            jsb.reflection.callStaticMethod("RootViewController","copyRoomIDToPatseBoard:",str);
        }
    }
};
// gvoice 开始录音
cc.dd.startRecordingWithGvoice = () => {
    if(cc.sys.isMobile) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {

        }else {
            jsb.reflection.callStaticMethod("RootViewController", "startGvoiceRecord");
        }
    }
};

// gvoice 停止录音，并上传录音
cc.dd.stopRecordingWithGvoice = () =>{
    if (cc.sys.isMobile) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {

        } else {
            jsb.reflection.callStaticMethod("RootViewController", "stopGvoiceRecord");
        }
    }
};

// gvoice 下载并播放语音消息
cc.dd.downloadAndPlayMessageWithMessageID = (mesID) => {
    if (cc.sys.isMobile) {
        cc.log("调用原生sdk下载并播放");
        if (cc.sys.os == cc.sys.OS_ANDROID) {

        } else {
            jsb.reflection.callStaticMethod("RootViewController", "playGvoiceMessage:",mesID);
        }
    }
};