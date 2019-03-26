const runBeforeParseTasks = require('./runBeforeParseTasks');
const path = require('path');
const entry = path.join(process.cwd(), 'source', 'app.js');
const parser = require('../packages/index')(entry);
const webpack = require('webpack');
const webpackOptions = require('../config/webpack');

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
        await runBeforeParseTasks(args);
        // await parser.parse();
        
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

