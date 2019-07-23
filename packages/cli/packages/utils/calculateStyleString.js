const generate = require('@babel/generator').default;
const isVar = /Expression|Identifier/;
const rhyphen = /([a-z\d])([A-Z]+)/g;
function hyphen(target) {
    return target.replace(rhyphen, '$1-$2').toLowerCase();
}
module.exports = function calculateStyleString(expr) {
    return expr.properties
        .map(function (node) {
        return (hyphen(node.key.name) +
            ': ' +
            (isVar.test(node.value.type)
                ? `{{${generate(node.value).code.replace(/this\./, '')}}}`
                : node.value.value));
    })
        .join(';');
};
