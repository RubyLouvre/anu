module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "plugins": ["react"],
    "parser": "babel-eslint",
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "keyword-spacing": [
            2,
            {
                "before": true,
                "after": true
            }
        ],
        "react/jsx-uses-vars": 2
    },
    "globals": {
        "wx": true,
        "expect": true,
        "describe": true,
        "test": true
    }
};