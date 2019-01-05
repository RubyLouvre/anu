import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-re';
import filesize from 'rollup-plugin-filesize';
import cleanup from 'rollup-plugin-cleanup';

const license = require('rollup-plugin-license');
const json = require('../../package.json');
//const importAlias = require('rollup-plugin-import-alias');

export default {

    input: './packages/render/dom/index.ie8.js',
    output: {
        strict: false,
        format: 'umd',
        exports: 'default',
        file:  './dist/ReactIE.js',
        name: 'React',
    },
    plugins: [

        babel(),

        license({
            banner: `IE6+，有问题请加QQ 370262116 by 司徒正美 Copyright ${JSON.stringify(
                new Date()
            ).replace(/T.*|"/g,'')}`
        }),
        cleanup(),
        replace({
            patterns: [
                {
                    test: 'VERSION',
                    replace: json.version
                }
        
            ]
        }),
        filesize()
    ]
};
