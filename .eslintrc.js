/* global module */
module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "globals": {
        "define": true,
        "expect": true,
        "describe": true,
        "it": true,
        "webpackIsomorphicTools": true,
        "__CLIENT__": true,
        "__SERVER__": true,
        "__DEVELOPMENT__": true,
        "__DEVTOOLS__": true,
        "__INITIAL_STATE__": true
    },
    "rules": {
        "strict": 0,
        "indent": ["error", 2],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "comma-dangle": [2, "only-multiline"],
        "eqeqeq": ["error", "always"],
        "no-alert": "error",
        "no-eval": "error",
        "guard-for-in": "error",
        "no-new-func": "error",
        "no-with": "error",
        "for-direction": "error",
        "curly": "error",
        "brace-style": ["error", "1tbs"],
        "no-bitwise": "error",
        "no-extend-native": "error",
        "array-callback-return": "error",
        "no-useless-call": "error",
        "no-sequences": "error",
        "no-restricted-properties": [2, {
            "property": "localStorage"
        }],
        "no-unmodified-loop-condition": "error",
        "no-underscore-dangle": ["off"],
        "react/prefer-stateless-function": ["off"],
        "max-len": ["error", 200, 4],
        "one-var": ["off"],
        "no-confusing-arrow": "off",
        "react/jsx-no-bind": ["off"],
        "react/jsx-indent": [2, 4],
        "react/jsx-indent-props": [2, 4],
        "react/jsx-boolean-value": ["off"],
        "eol-last": 0,
        "no-param-reassign": [1],
        "no-template-curly-in-string": "error",
        "radix": "error"
    }
};