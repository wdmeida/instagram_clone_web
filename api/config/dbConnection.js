const mongo = require('mongodb');

const connectionDB = () => {
  const db = new mongo.Db(
    'instagram',
    new mongo.Server(
      'localhost',
      27017,
      {}
    ),
    {}
  );

  return db;
}

module.exports = () => connectionDB;