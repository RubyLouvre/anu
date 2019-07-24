"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
module.exports = function mapConfigName(config) {
    if (config.window) {
        modifyValue(config.window);
    }
    modifyValue(config);
};
const mapColor = {
    "#fff": "white",
    "#ffffff": "white",
    '#000': 'black',
    '#000000': 'black',
};
const mapBg = {
    "#fff": "light",
    "#ffffff": "light",
    '#000': 'dark',
    '#000000': 'dark',
};
function modifyValue(object, patch) {
    var barColor = object.navigationBarTextStyle, color, bg;
    if (barColor !== 'white' && barColor !== 'black') {
        color = mapColor[barColor] || 'white';
        if (barColor) {
            console.log(chalk_1.default.magenta(`navigationBarTextStyle的值为${barColor},强制转换为${color}`));
            object.navigationBarTextStyle = color;
        }
    }
    else {
        color = barColor;
    }
    var barBg = object.backgroundTextStyle;
    if (barBg !== 'dark' && barBg !== 'light') {
        bg = mapBg[barBg];
        if (!bg) {
            bg = color === 'white' ? 'dark' : 'light';
        }
        if (barBg) {
            object.backgroundTextStyle = bg;
            console.log(chalk_1.default.magenta(`backgroundTextStyle的值为${barBg},强制转换为${bg}`));
        }
    }
}
