import { api }  from './api.quick';

export function showMenu(instance, app){
    api.getSystemInfo({
        success: function(appInfo){
            api.showActionSheet({
                itemList: ['转发', '保存到桌面', '关于', '取消'],
                success: function (ret) {
                    switch (ret.index) {
                        case 0: //分享转发
                            var fn = instance.onShareAppMessage;
                            var obj = fn && fn();
                            if (obj){
                                api.share(obj);
                            }
                            fn = app.onGlobalShare;
                            obj = fn && fn();
                            if (obj){
                                api.share(obj);
                            }
                            break;
                        case 1:
                            // 保存桌面
                            api.createShortcut();
                            break;
                        case 2:
                            // 关于
                            api.redirectTo({
                                url: `pages/about/index?brand=${appInfo.brand}&version=${appInfo.version}`
                            });
                            break;
                        case 3:
                            // 取消
                            break;
                    }
                }
            });
        }
    });
    
}
