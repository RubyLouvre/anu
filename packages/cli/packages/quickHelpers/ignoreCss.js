const chalk = require('chalk');

module.exports = {
    'box-sizing': true,
    'overflow': true,
    'box-shadow': true,
    'letter-spacing': true,
    'min-height': true,
    'transition': true,
    'vertical-align': true,
    'white-space': true,
    'max-height': true,
    'float': true,
    'clear': true,
    'min-width': true,
    'max-width': true,
    'flex-flow': true,
    'word-break': true,
    'word-wrap': true,
    'border-bottom-style':true,
    'border-top-style':true,
    'border-left-style':true,
    'border-right-style':true,
    'border-top-left-radius': function(value) {
        if (/^\d+%$/.test(value)) {
            // eslint-disable-next-line
            console.log(chalk.yellow('Warning: 快应用不支持border-radius百分比属性，已删除 '));
            return true;
        }
        return false;
    },
    'border-top-right-radius': function(value) {
        if (/^\d+%$/.test(value)) {
            // eslint-disable-next-line
            console.log(chalk.yellow('Warning: 快应用不支持border-radius百分比属性，已删除 '));
            return true;
        }
        return false;
    },
    'border-bottom-left-radius': function(value) {
        if (/^\d+%$/.test(value)) {
            // eslint-disable-next-line
            console.log(chalk.yellow('Warning: 快应用不支持border-radius百分比属性，已删除 '));
            return true;
        }
        return false;
    },
    'border-bottom-right-radius': function(value) {
        if (/^\d+%$/.test(value)) {
            // eslint-disable-next-line
            console.log(chalk.yellow('Warning: 快应用不支持border-radius百分比属性，已删除 '));
            return true;
        }
        return false;
    },
    'zoom': true,
    'box-flex': true,
    'background-clip': true,
    'outline': true,
    'line-clamp': true,
    'text-shadow': true,
    'appearance': true,
    'overflow-y': true,
    display: function (value) {
        return !(value === 'flex' || value === 'none');
    },
    width: function(value){
         return /calc/.test(value)
    },
    margin: function(value){
        return value === '0 1%'
    },
    'font-weight': function(value) {
        return !(value === 'normal' || value === 'bold');
    },
    'align-items': function(value) {
        let rule = /stretch|flex-start|flex-end|center/i;
        return !rule.test(value);
    },
    'animation-fill-mode': function(value) {
        // none | forwards
        return !(value === 'none' || value === 'forwards');
    },
    'flex': function(value) {
        return !(parseInt(value) == value);
    }
};