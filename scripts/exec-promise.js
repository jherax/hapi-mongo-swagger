const {exec} = require('child_process');

const execPromise = cmd =>
  new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });

module.exports = execPromise;
