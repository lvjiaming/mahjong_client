/**
 * Created by Administrator on 2017/9/8.
 * 加载资源
 */
const ReLoad = {};
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
            if (callback instanceof Function) {
                callback(dir);
            }
        }
    });
};

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
