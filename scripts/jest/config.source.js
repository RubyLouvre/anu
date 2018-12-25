'use strict';

module.exports = {
    haste: {
        hasteImplModulePath: require.resolve('./noHaste.js'),
    },
    modulePathIgnorePatterns: [
        '<rootDir>/scripts/rollup/shims/',
        '<rootDir>/scripts/bench/',
    ],
    testURL:'http://localhost/',
    // 'testEnvironment': 'node',   
    setupFiles: [require.resolve('./setupEnvironment.js')],
    setupTestFrameworkScriptFile: require.resolve('./setupTests.js'),
    // Only include files directly in __tests__, not in nested folders.
    testRegex: '/__tests-cli__/[^/]*(\\.js|\\.coffee|[^d]\\.ts)$',
    moduleFileExtensions: ['js', 'json', 'node', 'coffee', 'ts'],
    rootDir: process.cwd(),
    roots: ['<rootDir>/packages', '<rootDir>/scripts'],
    collectCoverageFrom: ['packages/**/*.js'],
    timers: 'fake',
};
