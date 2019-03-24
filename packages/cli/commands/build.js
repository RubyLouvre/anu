const runBeforeParseTasks = require('./runBeforeParseTasks');
const path = require('path');
const entry = path.join(process.cwd(), 'source', 'app.js');
const parser = require('../packages/index')(entry);

module.exports = async function(args){
    await runBeforeParseTasks(args);
    await parser.parse();
    if (args['watch']) {
        parser.watching();
    }
};

