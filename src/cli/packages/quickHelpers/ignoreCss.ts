const ignoreCss: any = {
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
    'zoom': true,
    'box-flex': true,
    'background-clip': true,
    'outline': true,
    'line-clamp': true,
    'text-shadow': true,
    'appearance': true,
    'overflow-y': true,
    display: function (value: string) {
        return !(value === 'flex' || value === 'none');
    },
    width: function(value: string){
        return /calc/.test(value);
    },
    margin: function(value: string){
        return value === '0 1%';
    },
    'font-weight': function(value: string) {
        return !(value === 'normal' || value === 'bold');
    },
    'align-items': function(value: string) {
        let rule = /stretch|flex-start|flex-end|center/i;
        return !rule.test(value);
    },
    'animation-fill-mode': function(value: string) {
        // none | forwards
        return !(value === 'none' || value === 'forwards');
    },
    'flex': function(value: string) {
        return !(parseInt(value) == +value);
    }
}
module.exports = ignoreCss;
export default ignoreCss;