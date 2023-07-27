(function (env) {
  const rootuser = env.MONGO_INITDB_ROOT_USERNAME,
    rootpass = env.MONGO_INITDB_ROOT_PASSWORD,
    appuser = env.MONGO_INITDB_USERNAME,
    apppass = env.MONGO_INITDB_PASSWORD,
    database = env.MONGO_INITDB_DATABASE;
  let db = connect(`mongodb://${rootuser}:${rootpass}@localhost:27017/admin`);
  // we can not use "use" statement here to switch db
  db = db.getSiblingDB(database);
  if (!db.getUser(appuser)) {
    db.createUser({
      user: appuser,
      pwd: apppass,
      roles: [{role: 'readWrite', db: database}],
    });
  }
})(process.env);
