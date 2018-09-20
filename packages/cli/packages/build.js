const transform = require('./translatorAli/index');
const build = arg => transform(arg);

module.exports = build;
