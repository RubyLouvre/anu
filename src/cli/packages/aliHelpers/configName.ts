const navNames = {
    navigationBarBackgroundColor: 'titleBarColor',
    navigationBarTitleText: 'defaultTitle',
    enablePullDownRefresh: 'pullRefresh'
};
const barNames = {
    color: 'textColor',
    list: 'items'
};
const tabNames = {
    text: 'name',
    iconPath: 'icon',
    selectedIconPath: 'activeIcon'
};
/*
标题栏的配置 
微信与百度
navigationBarTitleText	String 导航栏标题文字内容	
navigationBarBackgroundColor	HexColor	#000000	导航栏背景颜色，如 #000000	
阿里
defaultTitle	String	否	页面标题
titleBarColor	HexColor	否	导航栏背景色


tab的配置
微信
color	HexColor	是		tab 上的文字默认颜色
list	Array	是		tab 的列表，详见 list 属性说明，最少2个、最多5个 tab
阿里
textColor	HexColor	否	文字颜色
items	Array	是	每个 tab 配置

tab的配置
微信
pagePath	String	是	页面路径，必须在 pages 中先定义
text	String	是	tab 上按钮文字
iconPath	String	否	图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，不支持网络图片。
当 position 为 top 时，不显示 icon。
selectedIconPath	String	否	选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，不支持网络图片。
当 position 为 top 时，不显示 icon。
阿里
pagePath	String	是	设置页面路径
name	String	是	名称
icon	String	否	平常图标路径
activeIcon	String	否	高亮图标路径
*/

module.exports = function mapConfigName(config: any) {
    if (config.window){
        swapProperty(config.window, navNames);
    }
    swapProperty(config, navNames);
    var tabBar = config.tabBar;
    if (tabBar) {
        tabBar = config.tabBar;
        swapProperty(tabBar, barNames);
        if (Array.isArray(tabBar.items)) {
            tabBar.items.forEach(function(tab: any) {
                swapProperty(tab, tabNames);
            });
        }
    }
};
function swapProperty(object: any, patch: any) {
    for (var option in object) {
        if (patch[option]) {
            var value = object[option];
            delete object[option];
            object[patch[option]] = value;
        }
    }
}
