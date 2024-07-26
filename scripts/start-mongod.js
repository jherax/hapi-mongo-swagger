/* eslint-disable no-console */
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const commands = [
  `cp .env docker/mongodb/.env`,
  `cd docker/mongodb`,
  `mkdir -p -m 777 .volumes/data/log`,
  `docker-compose up -d`,
];

exec(commands.join(' && '))
  .then(response => {
    const msg = response.stderr || response.stdout;
    console.info(['Docker compose up!', msg].join('\n'));
  })
  .catch(error => {
    console.info('ERROR -> ', error);
    process.exit(1);
  });
