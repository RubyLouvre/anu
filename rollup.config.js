import babel from 'rollup-plugin-babel';

export default {
    entry: './src/React.js',
    format: 'umd',
    exports: 'default',
    dest: './dist/React.js',
    plugins: [babel() ],
    moduleName: 'React',
    useStrict: false
}