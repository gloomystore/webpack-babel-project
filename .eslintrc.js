// eslint-disable-next-line no-undef
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": ["eslint:recommended", "eslint-config-prettier"],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
      'no-extra-semi':'error',
      "no-unused-vars": 'warn',
    },
    plugins:[
        "eslint-plugin-prettier"
    ]
}
