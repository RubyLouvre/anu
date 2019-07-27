function createCanvasContext(id, obj) {
    if (obj.wx && obj.wx.$element) {
        var el = obj.wx.$element(id);
        let ctx = el && el.getContext('2d');

        'strokeStyle,textAlign,textBaseline,fillStyle,lineWidth,lineCap,lineJoin,miterLimit,globalAlpha'
            .split(',')
            .map(item => {
                var method = 'set' + item.substring(0, 1).toUpperCase() + item.substring(1);

                ctx[method] = function(value) {
                    ctx[item] = value;
                };
            });
        ctx.setFontSize = function(value) {
            ctx.font = value + 'px';
        };
        ctx.draw = function() {
            ctx.closePath();
        };

        return ctx;
    } else {
        throw new Error('createCanvasContext 第二个 字段 this 必须添加');
    }
}

export { createCanvasContext };
