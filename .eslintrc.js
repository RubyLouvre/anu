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
            "double"
        ],
        "curly": "error",
        "brace-style": ["error", "1tbs"],
        "semi": [
            "error",
            "always"
        ]
    }
};

