const { transformLess } = require('./utils/utils');
const path = require('path');
const fs = require('fs-extra');
const CleanCSS = require('clean-css');

const BUILD_TYPE = 'wx';
const less = require('less');
const tests = [{
    category: 'extend'
}, {
    category: 'loops'
}, {
    category: 'merge'
},{
    category:  'mixin'
},{
    category:  'parentSelectors'
},{
    category:  'variables'
}];

tests.forEach(t => {
    describe(t.category, () => {
        const dir = fs.readdirSync(path.join(__dirname, './less', t.category));
        dir.forEach(file => {
            if (file.endsWith('.less')) {
                const code = fs.readFileSync(path.join(__dirname, './less', t.category, file), 'utf-8');
                test(file, async () => {
                    const result = await transformLess(code, BUILD_TYPE, path.join(__dirname, './less', t.category, file));
                    const lessRes = await less.render(code, {
                        paths: ['./packages/cli/__tests__/less/variables']
                    });
                    expect(new CleanCSS({
                        format: 'beautify' // formats output in a really nice way
                    }).minify(result).styles).toMatch(
                        new CleanCSS({
                            format: 'beautify' // formats output in a really nice way
                        }).minify(lessRes.css).styles
                    );
                });
            }
        });
    });
    
});
