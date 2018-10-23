let babel = require('@babel/core');
const prettifyXml = require('prettify-xml');
let jsTransform = require('../../packages/translator/jsTransform');
let helpers = require('../../packages/translator/helpers');
function baseCode(code, state = '', head = '', methods = '') {
    return `
    ${head}
    import React from '../../../../dist/ReactWXTest'
    class Index extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
            ${state}
        }
      }
      ${methods}
      config = {
        navigationBarTextStyle: '#fff',
        navigationBarBackgroundColor: '#0088a4',
        navigationBarTitleText: 'Demo',
        backgroundColor: '#eeeeee',
        backgroundTextStyle: 'light'
      };
      render() {
       ${code}
      }
    }
    React.toPage(Index, 'pages/index/index', {});
    `;
}

exports.transform = function(code, state, head, methods) {
    code = baseCode(code, state, head, methods);
    var result = babel.transform(code, {
        babelrc: false,
        plugins: [
            [require('@babel/plugin-proposal-decorators'), {decoratorsBeforeExport: true}],
            require('@babel/plugin-syntax-jsx').default,
            require('@babel/plugin-proposal-object-rest-spread').default,
            require('@babel/plugin-transform-async-to-generator').default,
            require('babel-plugin-transform-es2015-template-literals'),
            jsTransform.miniappPlugin
        ]
    });

    return helpers.moduleToCjs.byCode(result.code).code;
};

exports.evalClass = function(template) {
    return eval(template);
};
exports.getTemplate = function getTemplate(q){
    return prettifyXml(q.wxml[q.wxml.length - 1].code);
};
exports.getPropsStyle = function(props) {
    let styles = [];
    for (let key in props) {
        if (/^style\d{2,}/.test(key)) {
            styles.push(props[key]);
        }
    }

    return styles;
};
