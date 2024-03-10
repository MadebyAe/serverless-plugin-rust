module.exports = {
  env: {
    'jest/globals': true,
    es2021: true
  },
  plugins: ['jest'],
  extends: ['plugin:jest/recommended', 'standard'],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}
