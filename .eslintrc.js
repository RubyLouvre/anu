/* global module */
module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "globals": {
        "module": true,
        "define": true,
        "expect": true,
        "it": true,
        "describe": true,
        "exports": true
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "strict": 0,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "curly": "error",
        "brace-style": ["error", "1tbs"],
        "semi": [
            "error",
            "always"
        ],
        "max-len": ["error", 200, 4],
        "one-var": ["off"],
        "no-confusing-arrow": "off",
        "react/jsx-no-bind": ["off"],
        "react/jsx-indent": [2, 4],
        "react/jsx-indent-props": [2, 4],
        "react/jsx-boolean-value": ["off"]
    }
};


