import execPromise from '../exec-promise';

describe('Testing execPromise', () => {
  /**
   * process.cwd(): returns the current working directory,
   * __dirname: returns the directory name of the directory containing the JavaScript source code file
   */
  const CWD = process.cwd();

  it('should list the CWD content', async () => {
    expect.assertions(2);
    const result = await execPromise(`ls ${CWD}`);
    const files = result.split('\n').filter(Boolean);
    expect(files.length).toBeGreaterThanOrEqual(8);
    expect(files).toContain('README.md');
  });

  it('should reject the promise', async () => {
    expect.assertions(1);
    try {
      await execPromise('unknown-cmd');
    } catch (error) {
      expect(error.toString()).toContain('unknown-cmd: not found');
    }
  });
});
