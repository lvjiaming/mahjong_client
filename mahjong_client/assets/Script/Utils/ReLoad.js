/**
 * Created by Administrator on 2017/9/8.
 * 加载资源
 */
const ReLoad = {};
const DirRes = {};
/**
 *  加载整个文件夹的资源
 * @param path 路径
 * @param callback 回调
 */
ReLoad.loadDir = (path, callback) => {
    cc.loader.loadResDir(path, (err, dir) => {
        if (err) {
            cc.error(err);
        } else {
            ReLoad._parseDirRes(dir);
            if (callback instanceof Function) {
                callback();
            }
        }
    });
};
/**
 *  处理加载的整个目录里资源
 */
ReLoad._parseDirRes = (list) => {
    list.forEach(function (item, index) {
        if (item instanceof cc.Texture2D) {
            var key = "";
            if (cc.sys.isNative) {
                key = item.getName();//getPath();
            } else {
                var url = item.url;
                var split_url = url.split('/');
                var sub_url = split_url[split_url.length - 1].split('.');
                key = sub_url[0].toUpperCase();
            }
            DirRes[key] = item;
        }else if (item instanceof cc.SpriteFrame) {
            DirRes[item.name.toUpperCase()] = item;
        }else if (item instanceof cc.Prefab) {
            DirRes[item.name.toUpperCase()] = item;
        }else if (item instanceof cc.SpriteAtlas) {
            //AppLog.log("_parseRes >> SpriteAtlas item.name:%s",item.name);
            var split_list = item.name.split('.');
            var atlas_list = {};
            for (let items in item._spriteFrames) {
                atlas_list[item.name.toUpperCase()] = items;
            }
            DirRes[split_list[0].toUpperCase()+"_ATLAS"] = item;
            DirRes[split_list[0].toUpperCase()] = atlas_list;
        }
    });
},

/**
 *  加载预制资源
 * @param path 资源路径
 * @param callback 回调
 */
ReLoad.loadPrefab = (path, callback) => {
    cc.loader.loadRes(path, (err, prefab) => {
        if (err) {
            cc.error(`加载资源错误：${err}`);
        } else {
            if (callback instanceof Function) {
                callback(prefab);
            }
        }
    });
};
/**
 *  加载图集资源
 * @param path 资源路径
 * @param callback 回调
 */
ReLoad.loadAtlas = (path, callback) => {
    cc.loader.loadRes(path, cc.SpriteAtlas,(err, atlas) => {
        if (err) {
            cc.error(`加载资源错误：${err}`);
        } else {
            if (callback instanceof Function) {
                callback(atlas);
            }
        }
    });
};
/**
 *  加载精灵帧资源
 * @param path 路径
 * @param name 名字
 * @param callback 回调
 */
ReLoad.loadSpriteFrame = (path, name, callback) => {
    ReLoad.loadAtlas(path, (atlas) => {
        const frame = atlas.getSpriteFrame(name);
        if (callback instanceof Function) {
            callback(frame);
        }
    });
};
cc.dd.Reload = ReLoad;
cc.dd.dirRes = DirRes;
