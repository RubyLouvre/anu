var runicode = /\\u[a-f\d]{4}/i,
    runifirst = /\\/g

module.exports = function createChineseHack() {
    return {
        collect(path) {
            var valueNode = path.node.value;
            var target;
            if (valueNode) {
                if (valueNode.type === "StringLiteral") {
                    // placeholder="中文"
                    target = valueNode
                } else if (valueNode.type === "JSXExpressionContainer" &&
                    valueNode.expression.type === "StringLiteral"
                ) {
                    // placeholder={"中文"}
                    target = valueNode.expression
                }
                
                if (target && runicode.test(target.value)) {
                    if (!this.unicodeNumber) {
                        this.unicodeNumber = Math.random().toString().slice(-10)
                        this.unicodeMather = RegExp(this.unicodeNumber, "g")
                    }
                    this.unicodeArray.push(unescape(valueNode.value.replace(runifirst, "%")))
                    target.value = this.unicodeNumber
                }
            }
        },
        unicodeNumber: 0,
        unicodeArray: [],
        recovery(html) {
            var unicodeArray = this.unicodeArray
            if (this.unicodeNumber) {
                html = html.replace(this.unicodeMather, function (a) {
                    var el =  unicodeArray.shift()
                    return el;
                })
                this.unicodeNumber = 0
            }
            return html;
        }
    }
}