var webpack = require('webpack');
module.exports = {
    entry: [
        './src/React.js'
    ],
    module: {
        loaders: [{
            test: '\.js$',
            loaders: 'babel'
        }]
    },
    output: {
        path: './dist',
        filename: 'React.js',
        library: 'React',
        libraryTarget: 'umd',
        // umdNamedDefine: true
    }
}