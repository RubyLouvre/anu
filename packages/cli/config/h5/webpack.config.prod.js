/**
 * This configuration file is reserved for building ES2015+ bundle.
 * The environment to run this bundle should support
 * features defined in ES2015+ like Promise, async/await, Symbol etc.
 */
const developmentConfig = require('./webpack.config');
const merge = require('webpack-merge');

module.exports = merge(developmentConfig, {
    mode: 'development'
});
