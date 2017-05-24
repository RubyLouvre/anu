import babel from 'rollup-plugin-babel';

export default {
    entry: './devtools/index.js',
    format: 'umd',
    exports: 'default',
    dest: './dist/devtools.js',
    plugins: [babel() ],
    moduleName: 'DevTools',
    useStrict: false
}