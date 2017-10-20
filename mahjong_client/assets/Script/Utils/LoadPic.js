// 下载头像

var LoadImageTool = cc.Class({

});

LoadImageTool.LoadAvatar = (halfurl) => {
    var fullUrl = cc.dd.pubConst.IMAGE_PREFIX_HOST + halfurl;
    cc.log("拼接头像地址："+fullUrl);
    cc.loader.load(fullUrl, function(err, texture){
        if (err){
            cc.log("头像下载错误： " + err);
        }else {
            return texture;
        }
    });
};

module.exports = LoadImageTool;