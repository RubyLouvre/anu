function parsePath(a, b) {
    if (b[0] !== "." && b[0] !== "/") {
        console.log("格式不对[ " + b + " ]", b[0]);
        return;
    }
    var arr = a.split("/");
    if (b[0] == "/") {
        arr.pop();
        return arr.join("/") + b;
    }
    if (b.slice(0, 2) == "./") {
        arr.pop();
        return arr.join("/") + b.slice(1);
    }
    var jump = b.match(/\.\.\//g);
    if (jump) {
        var newB = b.replace(/\.\.\//g, "");
        arr.pop();
        for (var i = 0; i < jump.length; i++) {
            arr.pop();
        }
        return arr.join("/") + "/" + newB;
    }
    throw "格式不对[ " + b + " ]";
}

const componentLiftMethods = {
    created: 1,
    attached: 1,
    ready: 1,
    moved: 1,
    detached: 1,
    relations: 1,
    externalClasses: 1,
    options: 1,
    data: 1,
    properties: 1
};

module.exports = {
    parsePath
};
