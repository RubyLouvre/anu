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
module.exports = function mapConfigName(config) {
    if (config.window) {
        swapProperty(config.window, navNames);
    }
    swapProperty(config, navNames);
    var tabBar = config.tabBar;
    if (tabBar) {
        tabBar = config.tabBar;
        swapProperty(tabBar, barNames);
        if (Array.isArray(tabBar.items)) {
            tabBar.items.forEach(function (tab) {
                swapProperty(tab, tabNames);
            });
        }
    }
};
function swapProperty(object, patch) {
    for (var option in object) {
        if (patch[option]) {
            var value = object[option];
            delete object[option];
            object[patch[option]] = value;
        }
    }
}
