/**
 * Created by kory on 2017/01/26.
 */

var AppUtils = cc.Class({

});

//屏幕适配
AppUtils.setScreenFit = function ( canvas_node ) {
    var winSize = cc.director.getWinSize();
    var frameSize = cc.view.getFrameSize ();
    var visibleSize = cc.director.getVisibleSize();
    var visibleOrigin = cc.director.getVisibleOrigin();

    var realWH = frameSize.width/frameSize.height;
    //var designWH = 1280/720; //设计分辨率宽高比=1.777777

    if ( realWH < 1.5 ) { //iPad=1.333, iphone4=1.5: 不要拉伸缩放(留黑边)
        canvas_node.getComponent(cc.Canvas).fitWidth = true;
    } else { //其它分辨率: 需拉伸缩放填满屏幕
        canvas_node.scaleY = visibleSize.height/winSize.height;
        canvas_node.scaleX = visibleSize.width/winSize.width;
    }

    cc.log("setScreenFit >>> scaleX:%s scaleY:%s visibleSize:(%s,%s) orig:(%s,%s) frameSize:(%s,%s) winSize:(%s,%s)",
        canvas_node.scaleX, canvas_node.scaleY,
        visibleSize.width, visibleSize.height, visibleOrigin.x, visibleOrigin.y,
        frameSize.width, frameSize.height, winSize.width, winSize.height);  
};


module.exports = AppUtils;
