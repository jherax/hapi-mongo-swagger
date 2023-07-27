import {init, prepareDb} from './server';

/**
 * @see https://hapi.dev/tutorials/testing
 */
init().then(prepareDb);
