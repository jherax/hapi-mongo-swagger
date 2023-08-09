/* eslint-disable no-console */
const execPromise = require('./exec-promise');

const commands = [
  `cp .env docker/mongodb/.env`,
  `cd docker/mongodb`,
  `mkdir -p -m 777 .volumes/data/log`,
  `docker compose up -d`,
];

execPromise(commands.join(' && '))
  .then(response => {
    console.info(`Docker compose up! ${response}`);
  })
  .catch(error => {
    console.info('ERROR -> ', error);
    process.exit(1);
  });
