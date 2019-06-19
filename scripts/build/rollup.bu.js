import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-re';
import filesize from 'rollup-plugin-filesize';
import cleanup from 'rollup-plugin-cleanup';

const license = require('rollup-plugin-license');
const json = require('../../package.json');
//const importAlias = require('rollup-plugin-import-alias');

export default {
    input: './packages/render/miniapp/index.bu.js',
    output: [{
        strict: false,
        format: 'es',
        // exports: 'default',
        file: './dist/ReactBu.js',
        name: 'React'
    }, {
        strict: false,
        format: 'es',
        // exports: 'default',
        file: './packages/cli/lib/ReactBu.js',
        name: 'React'
    }],
    plugins: [
        babel({
       
            //  presets: ['es2015', 'react'],
            plugins: [
                'transform-class-properties',
                [
                    'transform-es2015-classes',
                    {
                        loose: true
                    }
                ],
                [
                    'module-resolver',
                    {
                        root: ['.'],
                        alias: {
                            'react-core':'./packages/core',
                            'react-fiber': './packages/fiber',
                        }
                    }
                ]
            ]
            
        }),

        license({
            banner: `运行于支付宝小程序的React by 司徒正美 Copyright ${JSON.stringify(
                new Date()
            ).replace(/T.*|"/g, '')}
      `
        }),
        cleanup(),
        replace({
            // ... do replace before commonjs
            patterns: [
                {
                    test: 'VERSION',
                    // string or function to replaced with
                    replace: json.version
                }
            ]
        }),
        filesize()
    ]
};
