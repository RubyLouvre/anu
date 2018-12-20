const postCssFunctions = require('postcss-functions');

const functions = { pi: () => (Math.PI), color: (color) => (color) };

module.exports = postCssFunctions({ functions });