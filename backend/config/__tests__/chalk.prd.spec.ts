import chalk from '../chalk.prd';

describe('Testing "chalk.prd"', () => {
  it('should return the same entry text', () => {
    const levels = {
      error: chalk.red.bold,
      warn: chalk.yellow.bold,
      info: chalk.green.bold,
      debug: chalk.cyan.bold,
    };

    const levelKeys = Object.keys(levels);
    expect.assertions(levelKeys.length);

    const timestamp = new Date().toISOString();
    const timeColor = chalk.gray(`[${timestamp}]`);

    levelKeys.forEach(key => {
      const levelColor = levels[key](key.toUpperCase());
      const text = `${timeColor} [${levelColor}]: Logger message`;
      // expected result is something like this:
      // "[2023-08-09T22:06:16.714Z] [INFO]: Logger message"
      expect(chalk.blue.underline(text)).toBe(text);
    });
  });
});
