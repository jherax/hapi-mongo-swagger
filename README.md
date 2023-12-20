# GraphQL API based on Hapi with Swagger powered by MongoDB

[GraphQL](https://graphql.org/) API based on Nodejs with
[Swagger](https://swagger.io/) documentation powered by
[MongoDB](https://www.mongodb.com/)

Instead of going with Express, we are going with Hapi. In a nutshell, Hapi is a
Node framework. The reason why I chose Hapi is rather simple — simplicity and
flexibility over the boilerplate code.

Hapi enables us to build our API in a very rapid manner.

## Environment

Make sure to set the env variables. For local environment you can create a
`.env` file with the following environment variables:

```properties
APP_HOST=localhost
APP_PORT=4000
# dev | prod | qa
NODE_ENV=dev

# https://www.npmjs.com/package/jsonwebtoken
JWT_PRIVATE_KEY=your_own_secret_key
JWT_EXPIRY_TIME=24h
```

Also you may change the log level by setting the env variable `LOG_LEVEL` to the
available values `error | warn | info | debug`. By default `LOG_LEVEL` is set to
`info`.

This application uses [winston](https://github.com/winstonjs/winston) as logging
library with support for multiple transports. A transport is essentially a
storage device for your logs. Default transports are `Console` and
`DailyRotateFile`

ESLint disables the use of `console.*` methods, use the following methods
instead:

```js
logger.error('Message to the logger');
logger.warn('Message to the logger');
logger.info('Message to the logger');
logger.debug('Message to the logger');
```

## Prepare the app

After cloning the repository, run the following commands:

```bash
npm install
npm run prepare
```

## Running the server

Just run the command

```bash
npm run mongod
npm run dev-server
```

## Apollo GraphQL

The path that resolves Apollo queries is: `/graphql`.\
The following queries require the `Authorization` header with a valid JWT token:

- `getPaintings`
- `getPaintingById`
- `createPainting`
- `deletePainting`
- `editPainting`

You can generate a valid JWT token by executing the query `login`, and retrieve
the value from the property `"jwtoken"` in the response. See an example of
generating a valid token for an existing user here:
[`/user.auth.http`](backend/graphql/__tests__/user.auth.http)

In the `.http` files that require `Authorization` you will see the `@auth_token`
variable which points to the environment `JWT_AUTH_TOKEN`, so you will need to
create that variable in your `.env` file in order to get those `.http` files
working properly.

```properties
# .env
JWT_AUTH_TOKEN=some_valid_token_generated_by_login
```

💡 When running in non-production environment, the `/graphql` and `/sandbox`
paths are enabled to run an
[Apollo Sandbox](https://www.apollographql.com/docs/graphos/explorer/sandbox/)
environment where we can now execute GraphQL our queries on our own server.

- Default path: [localhost:4000/sandbox](http://localhost:4000/graphql)
- Online Sandbox:
  [studio.apollographql.com/sandbox](https://studio.apollographql.com/sandbox/)

⚠️ Running the local server requires docker, if docker has not been configured,
then follow next steps: [docker](#docker) 👇

## docker

MongoDB is loaded as a docker container, sou you need to make sure to create a
`.env` file with the following environment variables:

```properties
DB_ROOT_USERNAME=root
DB_ROOT_PASSWORD=root
DB_INIT_USERNAME=appuser
DB_INIT_PASSWORD=symfony
DB_NAME=vantage
DB_HOST=localhost
DB_PORT=27012
ME_PORT=3001
```

In order to run MongoDB, you need to mount the docker container, and start the
`mongod` service. To do that just run the command:

```bash
npm run mongod
```

After that, let's make sure the container is running:

```bash
docker ps -a
```

You should have a result like this:

```bash
CONTAINER ID   IMAGE         COMMAND                  CREATED      STATUS        PORTS                     NAMES
db936f592d4d   mongo:6.0.8   "docker-entrypoint.s…"   1 hour ago   Up 2 minute   0.0.0.0:27012->27017/tcp  mongodb_6
6f518f569c4b   mongo-express "tini -- /docker-ent…"   1 hour ago   Up 2 minutes  0.0.0.0:3001->8081/tcp    mongo-express
```

To open [mongo-express](https://github.com/mongo-express/mongo-express), the
web-based MongoDB admin interface, go to the browser and navigate to
`http://localhost:3001/`, using credentials in the env variables
`DB_INIT_USERNAME` and `DB_INIT_PASSWORD`

If you want to opent the terminal to run commands on the container, just run the
following command for the specific container:

```bash
docker exec -it mongodb_6 bash
root@mongodb:/#
```

## Standard-version

`standard-version` is a utility for versioning using semver and CHANGELOG
generation powered by Conventional Commits.

> `standard-version` is deprecated. If you're a GitHub user, I recommend
> [`release-please`](https://github.com/googleapis/release-please) as an
> alternative.

`standard-version` needs to have a starting point to append the CHANGELOG and
other versions to. Simply run:

```bash
npm run release -- --first-release
```

### Usage

For a new release, just run

```bash
npm run release
```

For more details, please visit the Github site
[standard-version](https://github.com/conventional-changelog/standard-version)

## Husky

Husky supports all [Git hooks](https://git-scm.com/docs/githooks). You can use
it to lint your commit messages, run tests, lint code, etc... when you commit or
push.

See more in the Github site: [husky](https://github.com/typicode/husky)

### Configure

To set up `husky` in a new project, follow these steps:

```bash
npm install husky -D
```

Edit `package.json` > `prepare` script, and add as follow:

```json
"prepare": "husky install"
```

Then, run the command:

```bash
npm run prepare
```

To add a hook:

```bash
npx husky add .husky/pre-commit "eslint and prettier commands"
npx husky add .husky/post-commit "git update-index -g"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
git add .husky/
git commit -m "chore: Added git hooks with husky"
```

See:
[conventional-changelog/commitlint](https://github.com/conventional-changelog/commitlint).
