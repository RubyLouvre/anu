import typescript from 'rollup-plugin-typescript';

//const importAlias = require('rollup-plugin-import-alias');

export default {
    input: './main.ts',
    output: [{
        strict: false,
        format: 'umd',
       
        file: './dist/ReactTs.js',
        name: 'React'
    }],
    plugins: [
        typescript({lib: ["es5", "es6", "dom"], target: "es5"})
    ]

};
