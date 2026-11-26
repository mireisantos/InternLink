// https://docs.expo.dev/guides/using-eslint/
// .cjs because package.json sets "type": "module".
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
