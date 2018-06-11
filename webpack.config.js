var path = require('path');
module.exports = {
    entry: './rematch.ex/index.js',
    output: {
        libraryTarget: 'umd',
        filename: 'bundle.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test:/\.(js|jsx)$/,
                use:[ {
                    loader:'babel-loader',
                    options: {
                    
                        'presets': [
                            ['env', { 'modules': false }], 'react'
                        ],
                       
                        'plugins': [
                            [  'transform-class-properties',
                                'transform-es2015-classes', {
                                    'loose': true
                                }
                            ],
                            ['transform-runtime',{
                                'helpers': false,
                                'polyfill': false,
                                'regenerator': true,
                                'moduleName': 'babel-runtime'
                            }],
                            ['transform-object-rest-spread', { 'useBuiltIns': true }],
                      
                            ['module-resolver', {
                                'root': ['.'],
                                'alias': {
                               
                                    'react': './dist/React',
                                 
                                    'react-dom': './dist/React',
                                }
                            }]
                            
                        ]
                    
                    }
                }
                ],

                exclude:/node_modules/
            },
        ]
    },
    /*  externals: {

        react: 'react' ,

        'react-dom':'react-dom' ,
    },*/
    
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    resolve: {
      
        extensions: [ '.js'],
        alias: {
            react: path.resolve(__dirname, './dist/React.js'),
            'react-dom': path.resolve(__dirname, './dist/React.js'),
        }
    },
};