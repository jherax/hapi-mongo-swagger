/**
 * This module is intended to replace chalk in production mode,
 * because we don't care about coloring the console.
 * This module is injected by "esbuild".
 *
 * If you are using chalk, consider to mock the new colors
 * and properties as implemented below. Remember that
 * each property is a constant function which returns
 * the entry text.
 *
 * @see https://www.npmjs.com/package/chalk
 */

const colorfnMock = text => text;
const propfnMock = text => text;

colorfnMock.bold = propfnMock;
colorfnMock.underline = propfnMock;

const chalk = {
  red: colorfnMock,
  yellow: colorfnMock,
  green: colorfnMock,
  blue: colorfnMock,
  cyan: colorfnMock,
  gray: colorfnMock,
};

module.exports = chalk;
