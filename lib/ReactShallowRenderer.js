(function umd(root, factory) {
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        exports.ReactShallowRenderer = factory();
    } else {
        root.ReactShallowRenderer = factory();
    }
})(this, function() {
    function checkNull(vnode) {
        if (vnode === null || vnode === false) {
            return { type: "#comment", text: "empty", vtype: 0 };
        }
        return vnode;
    }
    return function ReactShallowRenderer() {
        return {
            render: function(vnode) {
                var ret;
                if (vnode.tag === 2) {
                    ret = checkNull(new vnode.type());
                    ret = checkNull(ret);
                } else if (vnode.tag === 1) {
                    ret = checkNull(vnode.type());
                } else {
                    ret = vnode;
                }
                this.ret = ret;
            },
            getRenderOutput: function() {
                return this.ret;
            }
        };
    };
});
