const t = require("babel-types");

/**
 * properties的type: ：String, Number, Boolean, Object, Array, null
 * NumericLiteral: Number
 * StringLiteral: String
 * BooleanLiteral: Boolean
 * ArrayExpression: Array
 * ObjectExpression: Object
 * NullLiteral: null
 */
const typeMap = {
    NumericLiteral: "Number",
    StringLiteral: "String",
    BooleanLiteral: "Boolean",
    ArrayExpression: "Array",
    ObjectExpression: "Object",
    NullLiteral: "null"
};

/**
 * convert defaultProps to Component Properties
 * @param {Array} properties AssignmentExpression right properties || ClassProperty's property (Array of objectProperty)
 */
module.exports = function(properties, modules) {
    let astList = [];
    properties.forEach(function(el) {
        const propertyAst = t.objectProperty(
            t.identifier(el.key.name),
            t.objectExpression([
                t.objectProperty(
                    t.identifier("type"),
                    t.identifier(typeMap[el.value.type])
                ),
                t.objectProperty(t.identifier("value"), el.value)
            ])
        );
        astList.push(propertyAst);
    });

    modules.thisMethods.push(
        t.objectProperty(t.identifier("properties"), t.objectPattern(astList))
    );
};
