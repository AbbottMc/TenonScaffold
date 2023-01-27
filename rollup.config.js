const typescript = require('@rollup/plugin-typescript');
const common = require('@rollup/plugin-commonjs');

module.exports = {
  input: './src/Commands.ts',
  output: [{
    file: './dist/index.js',
    format: 'commonjs'
  }],
  plugins: [
    common(),
    typescript()
  ]
}