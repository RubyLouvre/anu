const runBeforeParseTasks = require('./runBeforeParseTasks');
// const path = require('path');
// const entry = path.join(process.cwd(), 'source', 'app.js');
// const parser = require('../packages/index')(entry);
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = require('../packages/config');
const nanachi = require('../index');
// const cwd = process.cwd();
// const JavascriptParserFactory = require('../nanachi-loader/parsers/jsParser/JavascriptParserFactory');

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
        
        // await runBeforeParseTasks(args);
        const { buildType, beta, betaUi, watch, compress } = args;
        // const parser = JavascriptParserFactory.create({
        //     platform: 'wx',
        //     filepath: path.resolve(cwd, 'source/app.js')
        // });
        // const { options: { anu: { dependencies } }} = await parser.parse();
        // const entry = {};
        // dependencies.forEach((dep, index) => {
        //     entry[index] = path.join('source', dep).replace(/^(\w)/, './$1');
        // });
        // webpackOptions.entry = entry;
        nanachi({
            entry: './source/app.js',
            platform: buildType,
            beta,
            betaUi,
            compress,
            watch,
            plugins: [
                new CleanWebpackPlugin()     
            ],
            complete: callback
        });
        // const compiler = webpack(webpackOptions);
        
        // if (args['watch']) {
        //     compiler.watch({}, callback.bind(this));
        // } else {
        //     compiler.run(callback.bind(this));
        // }

    } catch (e) {
        // eslint-disable-next-line
        console.log(e);
        process.exit(1);
    }
};

