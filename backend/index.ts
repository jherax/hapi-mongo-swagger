import {initDb, initServer} from './server';

/**
 * @see https://hapi.dev/tutorials/testing
 */
initServer().then(initDb);
