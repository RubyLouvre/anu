/*!
 *
 * 这是用检测用户写的样式表是否符合快应用的要求
 */

/* eslint no-console: 0 */
const css = require('css');
const R = require('ramda');
const chalk = require('chalk');
const config = require('./config');
const generateProhibitValue = require('./stylesTransformer/generateProhibitValue');
const generateConflictDeclarations = require('./stylesTransformer/generateConflictDeclarations');
const replaceRPXtoPX = require('./stylesTransformer/replaceRPXtoPX');
const validateMargin = require('./stylesTransformer/validateMargin');
const splitBorder = require('./stylesTransformer/splitBorder');
const transformBorderRadius = require('./stylesTransformer/transformBorderRadius');

const gtOne = R.gt(1);

const visitors = {
    'border-style'(declaration) {
        const { value: rawValue } = declaration;
        if (!rawValue) return rawValue;
        const value = rawValue.match(/[a-z]+/gi);

        if (gtOne(value.length)) {
            console.log(
                chalk`{red border-style} should only have one value, got {red ${rawValue}},` +
                    chalk` only keeps the first value ({cyan ${value[0]}})`
            );
            declaration.value = value[0];
        }
    },
    'border-radius'(declaration) {
        generateConflictDeclarations(
            'border-radius',
            /border-(left|bottom|right|top)-(color|width)/i
        );
        transformBorderRadius(declaration);
    },
    background: generateConflictDeclarations(
        'background',
        /(background|border)-color/i
    ),
    'background-image'(declaration) {
        generateConflictDeclarations(
            'background-image',
            /(background|border)-color/i
        )(declaration);
        generateProhibitValue(
            'background-image',
            /url\(['"]https?:\/\/\S+['"]\)/i
        )(declaration);
    },
    margin: validateMargin,
    'border-left': splitBorder('left'),
    'border-right': splitBorder('right'),
    'border-bottom': splitBorder('bottom'),
    'border-top': splitBorder('top')
};

module.exports = function validateStyle(code) {
    if (config.buildType !== 'quick') return code;

    const ast = css.parse(code);
    const rules = ast.stylesheet.rules;

    var extractDeclarationsFromKeyframe = R.compose(
        R.flatten,
        R.pluck('declarations')
    );

    function extractKeyframesRules(rule) {
        return R.compose(
            R.flatten,
            extractDeclarationsFromKeyframe,
            R.prop('keyframes')
        )(rule);
    }

    function extractMediaRules(rule) {
        return R.compose(
            R.flatten,
            R.map(extractDeclarationsFromRule),
            R.prop('rules')
        )(rule);
    }

    // 验证规则类型 rule/media/keyframe/comment
    const isType = R.curry(type => R.propEq('type', type));

    var extractDeclarationsFromRule = R.cond([
        // 普通规则 .class { font-size: 12px }
        [isType('rule'), R.prop('declarations')],
        // 媒体查询 @media (min-width: 700px) { ... }
        [isType('media'), extractMediaRules],
        /**
         * @keyframes slide-in {
            from {
                margin-left: 100%;
                width: 300%;
            }

            to {
                margin-left: 0%;
                width: 100%;
            }
            }
         */
        [isType('keyframes'), extractKeyframesRules],
        // 其余任何情况，比如注释
        [R.T, R.always([])]
    ]);

    var extractDeclarationsFromRules = R.compose(
        R.flatten,
        R.map(extractDeclarationsFromRule)
    );

    extractDeclarationsFromRules(rules).forEach(declaration => {
        replaceRPXtoPX(declaration);
        if (visitors[declaration.property]) {
            visitors[declaration.property](declaration);
        }
    });

    return css.stringify(ast);
};
