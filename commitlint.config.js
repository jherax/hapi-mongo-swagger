/**
 * Message: "type(scope): commit message"
 * Example: `git commit -m "feat(scope): Removed before you go"`
 * @see https://commitlint.js.org/
 *
 * @commitlint/config-conventional rules:
 * @see https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional
 *
 * Also, you can extend existing type-enum:
 * const { rules } = require('@commitlint/config-conventional');
 * const typeEnum = [...rules['type-enum'][2], 'experiment'];
 */

const type = [
  'build',
  'chore',
  'ci',
  'docs',
  'feat',
  'fix',
  'refactor',
  'revert',
  'test',
];

const scope = [];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', Infinity],
    'type-enum': [2, 'always', type],
    'scope-enum': [0, 'always', scope],
    'subject-case': [1, 'always', 'sentence-case'],
  },
};
