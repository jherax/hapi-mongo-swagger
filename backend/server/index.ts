/* eslint-disable curly */
import type {ApolloServer} from '@apollo/server';
import {Server} from '@hapi/hapi';
import Qs from 'qs';

import connectDb from '../db/mongodb';
import registerRoutes from '../routes';
import logger from '../utils/logger';
import config from './config';
import events from './events';
import registerPlugins from './plugins';

const {host, port} = config.app;

/**
 * @see https://hapi.dev/tutorials/testing
 */
export class NodeServer {
  private _apollo: ApolloServer<ApolloServerContext>;
  private _server: Server;
  private _started = false;

  constructor(apolloServer: ApolloServer<ApolloServerContext>) {
    this._apollo = apolloServer;

    /**
     * @see https://akhromieiev.com/tutorials/using-cors-in-hapi/
     */
    const corsOptions = {
      origin: ['*'], // an array of origins or 'ignore' ('Access-Control-Allow-Origin')
      headers: ['Authorization'], // an array of strings ('Access-Control-Allow-Headers')
      exposedHeaders: ['Accept'], // an array of exposed headers ('Access-Control-Expose-Headers')
      maxAge: 60, // number of seconds. ('Access-Control-Max-Age')
      credentials: true, // boolean, allow user credentials. ('Access-Control-Allow-Credentials')
    };

    /**
     * How to run multiple servers:
     * @see https://futurestud.io/tutorials/hapi-how-to-run-separate-frontend-and-backend-servers-within-one-project
     */
    this._server = new Server({
      host,
      port,
      routes: {
        cors: corsOptions,
        files: {relativeTo: config.app.public},
      },
      router: {stripTrailingSlash: true},
      query: {parser: query => Qs.parse(query)},
    });
  }

  private async config() {
    await registerPlugins(this._server, this._apollo);
  }

  private async routerConfig() {
    registerRoutes(this._server);
  }

  public get server(): Server {
    return this._server;
  }

  public async initialize(): Promise<void> {
    await this.config();
    await this.routerConfig();
    await this._server.initialize();
  }

  public async start(): Promise<void> {
    if (this._started) return Promise.resolve();
    await this._server.start();
    logger.info(`🤖 Hapi server running at ${this._server.info.uri}`);
  }

  public startDB(): Promise<void> {
    if (this._started) return Promise.resolve();
    this._server.listener.on(events.SERVER_READY, this.start.bind(this));
    return connectDb(this._server);
  }
}
