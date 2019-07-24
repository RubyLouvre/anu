import postCss from 'postcss';
import { warning } from '../utils/logger/queue';

// 输出stylelint生成的warning
const postCssPluginReport = postCss.plugin('postcss-plugin-report', ()=> {
    return (root, result) => {
        const from = result.opts.from;
        result.messages.filter(m => {
            return m.plugin === 'stylelint';
        }).forEach(m => {
            // TODO: warning 还是 error
            warning.push({
                id: from,
                msg: m.text,
                loc: {
                    line: m.line,
                    column: m.column
                }
            });
        });
    };
});

module.exports = postCssPluginReport;