module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": "standard-with-typescript",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        '@typescript-eslint/semi': [2, "always"],
        '@typescript-eslint/no-misused-promises': [
            "error",
            {
                "checksVoidReturn": false
            }
        ]
    }
}
