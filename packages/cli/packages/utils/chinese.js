var runicode = /\\u[a-f\d]{4}/i,
    runifirst = /\\/g,
    rcn = /[\u4e00-\u9fa5]+/;
/**
 * 处理wxml中属性值中的中文被转义 的问题
 */
module.exports = function createChineseHack() {
    return {
        collect(astPath) {
            let valueNode = astPath.node.value;
            let target;
            if (valueNode) {
                astPath.traverse({
                    StringLiteral(astPath) {
                        target = astPath.node;
                        // console.log(target)
                    }
                });
                if (target) {
                    //如果本来就是汉字
                    if (rcn.test(target.value)) {
                        if (!this.unicodeNumber) {
                            this.createUnicode();
                        }
                        this.unicodeArray.push(target.value);
                        target.value = this.unicodeNumber;
                    } else if (runicode.test(target.value)) {
                        if (!this.unicodeNumber) {
                            this.createUnicode();
                        }

                        this.unicodeArray.push(
                            unescape(valueNode.value.replace(runifirst, '%'))
                        );
                        target.value = this.unicodeNumber;
                    }
                }
            }
        },
        createUnicode() {
            this.unicodeNumber = Math.random()
                .toString()
                .slice(-10);
            this.unicodeMather = RegExp(this.unicodeNumber, 'g');
        },
        unicodeNumber: 0,
        unicodeArray: [],
        recovery(html) {
            let unicodeArray = this.unicodeArray;
            if (this.unicodeNumber) {
                html = html.replace(this.unicodeMather, function() {
                    var el = unicodeArray.shift();
                    return el;
                });
                this.unicodeNumber = 0;
            }
            return html;
        }
    };
};
