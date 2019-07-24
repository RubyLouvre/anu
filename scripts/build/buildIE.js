const path = require('path');
const es3ifyPlugin = require('es3ify-webpack-plugin');
var p = path.resolve(process.cwd(), 'dist');
module.exports = {
    entry: {
        production: path.resolve(__dirname, './xxx.js')
    },
    output: {
        path: p,
        filename: 'ietest.js'
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            react: path.resolve(process.cwd(), './dist/ReactIE.js'),
            'react-dom': path.resolve(process.cwd(), './dist/ReactIE.js'),
            'prop-types': path.resolve(process.cwd(), './lib/ReactPropTypes.js'),
            'create-react-class': path.resolve(
                process.cwd(),
                './lib/createClass.js'
            )
        }
    },
    devtool: 'source-map',//不使用eval方便调试
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015-loose', 'react'],
                        plugins: [
                            'transform-class-properties',
                            [
                                'transform-es2015-classes',
                                {
                                    loose: true
                                }
                            ],
                            ['module-resolver', {
                                'root': ['.'],
                                'alias': {
                                    'react': './dist/ReactIE',
                                    'react-dom': './dist/ReactIE',
                                }
                            }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loade']
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100,
                            name: 'asset/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    mode: 'development',
    plugins: [new es3ifyPlugin()]
};
