import { defineConfig, } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin';
import html from "@html-eslint/eslint-plugin";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
  {
    ...html.configs[`flat/recommended`],
    files: [ `**/*.html` ],
    rules: {
      '@html-eslint/use-baseline': `off`
    }
  },
  {
    files: [ `**/*.js`, ],
    plugins: { js, '@stylistic': stylistic, },
    extends: [ `js/recommended` ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: `module`,
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': `off`,
      '@stylistic/array-bracket-spacing': [ `error`, `always`, ],
      '@stylistic/array-element-newline': [ `error`, `consistent`, ],
      '@stylistic/arrow-spacing': `error`,
      '@stylistic/block-spacing': [ `error`, `always`, ],
      '@stylistic/brace-style': `error`,
      '@stylistic/comma-spacing': `error`,
      '@stylistic/comma-style': [ `error`, `last`, ],
      '@stylistic/dot-location': [ `error`, `property` ],
      '@stylistic/function-call-spacing': [ `error`, `never` ],
      '@stylistic/generator-star-spacing': [ `error`, { before: false, after: true } ],
      '@stylistic/implicit-arrow-linebreak': [ `error`, `beside` ],
      '@stylistic/indent': [ `error`, 2, ],
      '@stylistic/key-spacing': [ `error`, { beforeColon: false } ],
      '@stylistic/keyword-spacing': [ `error`, { before: true } ],
      '@stylistic/member-delimiter-style': [ `error`, { multiline: { delimiter: `none` } } ],
      '@stylistic/multiline-ternary': [ `error`, `always-multiline` ],
      '@stylistic/new-parens': `error`,
      '@stylistic/newline-per-chained-call': [ `error`, { ignoreChainWithDepth: 2 } ],
      '@stylistic/no-extra-semi': `error`,
      '@stylistic/no-floating-decimal': `error`,
      '@stylistic/no-mixed-spaces-and-tabs': `error`,
      '@stylistic/no-multi-spaces': [ `error`, { ignoreEOLComments: true } ],
      '@stylistic/no-multiple-empty-lines': `error`,
      '@stylistic/no-tabs': `error`,
      '@stylistic/no-trailing-spaces': [ `error`, { ignoreComments: true } ],
      '@stylistic/no-whitespace-before-property': `error`,
      '@stylistic/nonblock-statement-body-position': [ `error`, `beside` ],
      '@stylistic/object-curly-spacing': [ `error`, `always`, ],
      '@stylistic/object-curly-newline': [ `error`, { consistent: true } ],
      '@stylistic/one-var-declaration-per-line': [ `error`, `always` ],
      '@stylistic/operator-linebreak': [ `error`, `after` ],
      '@stylistic/quotes': [ `error`, `backtick` ],
      '@stylistic/quote-props': [ `error`, `as-needed` ],
      '@stylistic/rest-spread-spacing': [ `error`, `never` ],
      '@stylistic/semi-spacing': `error`,
      '@stylistic/semi': [ `error`, `always` ],
      '@stylistic/semi-style': [ `error`, `last` ],
      '@stylistic/space-before-blocks': `error`,
      '@stylistic/space-before-function-paren': [ `error`, { named: `never`, asyncArrow: `always`, catch: `always` } ],
      '@stylistic/space-in-parens': [ `error`, `never` ],
      '@stylistic/space-infix-ops': `error`,
      '@stylistic/space-unary-ops': `error`,
      '@stylistic/switch-colon-spacing': `error`,
      '@stylistic/template-curly-spacing': `error`,
      '@stylistic/type-annotation-spacing': `error`,
      '@stylistic/type-generic-spacing': `error`,
      '@stylistic/type-named-tuple-spacing': `error`,
      '@stylistic/yield-star-spacing': [ `error`, `after` ]
    }
  }, ],);
