const runBeforeParseTasks = require('./runBeforeParseTasks');
const path = require('path');
const entry = path.join(process.cwd(), 'source', 'app.js');
// const parser = require('../packages/index')(entry);
const webpack = require('webpack');
const webpackOptions = require('../config/webpack');
const cwd = process.cwd();
const JavascriptParserFactory = require('../../nanachi-loader/parsers/jsParser/JavascriptParserFactory');

function callback(err, stats) {
    if (err) {
        console.log(err);
        return;
    }

    const info = stats.toJson();
    if (stats.hasErrors()) {
        info.errors.forEach(e => {
            console.error(e);
            process.exit();
        });
    }
}

module.exports = async function(args){
    try {
        // TODO：移除复制assets目录操作，使用copy-webpack-plugin插件完成
        await runBeforeParseTasks(args);
        const parser = JavascriptParserFactory.create({
            platform: 'wx',
            filepath: path.resolve(cwd, 'source/app.js')
        });
        const { options: { anu: {dependencies} }} = await parser.parse();
        const compiler = webpack(webpackOptions);
        
        if (args['watch']) {
            compiler.watch({}, callback.bind(this));
        } else {
            compiler.run(callback.bind(this));
        }

    } catch (e) {
        // eslint-disable-next-line
        console.log(e);
        process.exit(1);
    }
};

