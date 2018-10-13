
var _ReactWX = require('../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Component({
    properties: {
        renderUid: String,
        props: Object,
        state: Object,
        context: Object
    },
    data: {},
    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function (e) { 
        },
        moved: function () { },
        detached: function () { },
      },
    
})