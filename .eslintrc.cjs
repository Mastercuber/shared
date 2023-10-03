module.exports = {
    root: true,
    env: {
        es6: true,
        jest: true,
        jquery: true,
        browser: true
    },
    ignorePatterns: [
        'node_modules/',
        'package.json',
        'coverage/',
        'dist/',
        'html/',
        '.gitignore',
        'pnpm-lock.yaml',
        'tsconfig.json',
        '..eslintrc.cjs',
        'vite.config.ts',
    ],
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2023,
        sourceType: 'module',
        project: true,
        tsconfigRootDir: __dirname,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked'
    ],
    plugins: ['@typescript-eslint'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        'no-case-declarations': 'off'
    },
    overrides: [
        {
            files: ['*.js'],
            extends: ['plugin:@typescript-eslint/disable-type-checked'],
        },
    ],
}
