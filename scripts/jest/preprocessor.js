"use strict";

const path = require("path");

const babel = require("babel-core");


// Use require.resolve to be resilient to file moves, npm updates, etc
const pathToBabel = path.join(
    require.resolve("babel-core"),
    "..",
    "package.json"
);
/*
const pathToBabelPluginDevWithCode = require.resolve(
  '../error-codes/replace-invariant-error-codes'
);
const pathToBabelPluginWrapWarning = require.resolve(
  '../babel/wrap-warning-with-env-check'
);
const pathToBabelPluginAsyncToGenerator = require.resolve(
  'babel-plugin-transform-async-to-generator'
);
*/
const pathToBabelrc = path.join(__dirname, "..", "..", ".babelrc");
const pathToErrorCodes = require.resolve("./codes.json");

const babelOptions = {
    plugins: [
    // For Node environment only. For builds, Rollup takes care of ESM.
        require.resolve("babel-plugin-transform-es2015-modules-commonjs"),

        // pathToBabelPluginDevWithCode,
        //  pathToBabelPluginWrapWarning,

        // Keep stacks detailed in tests.
        // Don't put this in .babelrc so that we don't embed filenames
        // into ReactART builds that include JSX.
        // TODO: I have not verified that this actually works.
        require.resolve("babel-plugin-transform-react-jsx-source"),

        // require.resolve('../babel/transform-prevent-infinite-loops'),
    ],
    retainLines: true,
};

module.exports = {
    process: function(src, filePath) {
        if (filePath.match(/\.coffee$/)) {
            return src;
        }
        if (filePath.match(/\.ts$/) && !filePath.match(/\.d\.ts$/)) {
            return src;
        }
        if (!filePath.match(/\/third_party\//)) {
            // for test files, we also apply the async-await transform, but we want to
            // make sure we don't accidentally apply that transform to product code.
            return src;
        }
        return src;
    }
};
