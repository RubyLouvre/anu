const runBeforeParseTasks = require('./runBeforeParseTasks');
const path = require('path');
const entry = path.join(process.cwd(), 'source', 'app.js');
const parser = require('../packages/index')(entry);
const webpack = require('webpack');
const webpackOptions = require('../config/webpack');

module.exports = async function(args){
    try {
        // await runBeforeParseTasks(args);
        // await parser.parse();
        // if (args['watch']) {
        //     parser.watching();
        // }
        const compiler = webpack(webpackOptions);
        compiler.run((err, stats) => {
            if (err) {
                console.log(err);
            }

            const info = stats.toJson();
            if (stats.hasErrors()) {
                info.errors.forEach(e => {
                    console.error(e);
                });
            }
            
            // if (stats.hasWarnings()) {
            //     console.warn(info.warnings);
            // }
        });

    } catch (e) {
        // eslint-disable-next-line
        console.log(e);
        process.exit(1);
    }
};

