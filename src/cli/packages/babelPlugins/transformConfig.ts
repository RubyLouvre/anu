import platforms from '../../consts/platforms';
import generate from '@babel/generator';
import { validatePlatforms } from '../../config/config';

function transformConfig(modules: any, astPath: any, buildType: validatePlatforms){
    if (/App|Page|Component/.test(modules.componentType)) {
           try {
               var json = eval('0,' + generate(astPath.node.right).code);
               Object.assign(modules.config, json);
               //不同小程序的tabBar数量可能不存在，默认使用list
               var tabBar = modules.config.tabBar;
               //如果存在以buildType+"List"的列表，那么将它改成默认的list
               if (tabBar && tabBar[buildType+'List']){
                   tabBar.list = tabBar[buildType+'List'];
                   
                   platforms.forEach(function(el){
                       delete tabBar[el.buildType+'List'];
                   });
    
               }
               modules.configIsReady = true;
           } catch (e) {
               console.log('eval json error', e);
           }
       }
}

module.exports = transformConfig;
export default transformConfig;
