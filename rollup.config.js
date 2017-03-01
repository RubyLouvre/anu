// import nodeResolve from 'rollup-plugin-node-resolve';
// import babel from 'rollup-plugin-babel';
// import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
    entry: 'src/index.js',
    format: 'umd',
    exports: 'default',
    dest: 'dist/anu.js',
    moduleName: 'anu',
    useStrict: false,
    plugins: [
        //   nodeResolve({
        //       jsnext: true,  // Default: false
        //        main: true
        //    }),
        //     commonjs(),

        replace({
            global: 'window'
        })
    ]
};