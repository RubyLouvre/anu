import babel from 'rollup-plugin-babel';

export default {
    entry: './ssr/index.js',
    format: 'umd',
    exports: 'default',
    dest: './dist/ReactDOMServer.js',
    plugins: [babel() ],
    moduleName: 'ReactDOMServer',
    useStrict: false
}