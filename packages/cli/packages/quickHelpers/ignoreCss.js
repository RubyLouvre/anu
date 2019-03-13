module.exports = {
    'box-sizing': true,
    'overflow': true,
    'box-shadow': true,
    'letter-spacing': true,
    'min-height': true,
    'transition': true,
    'vertical-align': true,
    'white-space': true,
    display: function (value) {
        return !(value === 'flex' || value === 'none');
    }
};