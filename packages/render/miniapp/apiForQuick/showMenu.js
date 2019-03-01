
import { showActionSheet} from './dialog';
import { getSystemInfo }  from './device';
import { share }  from './share';
import { redirectTo }  from './router';
import { createShortcut } from './shortcut';

export function showMenu(instance, app){

    getSystemInfo({
        success: function(appInfo){
            showActionSheet({
                itemList: ['转发', '保存到桌面', '关于', '取消'],
                success: function (ret) {
                    switch (ret.index) {
                        case 0: //分享转发
                            var fn = instance.onShareAppMessage || app.onGlobalShare;
                            var obj = fn && fn();
                            if (obj){
                                share(obj);
                            }
                            break;
                        case 1:
                            // 保存桌面
                            createShortcut();
                            break;
                        case 2:
                            // 关于
                            redirectTo({
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
