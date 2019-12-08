require('dotenv').config();

const mysql = require('mysql');
const knex = require('knex');

const dbDefaultOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

function execute(queryBuilder) {
  return queryBuilder.then(success => success, failed => failed);
}

class Database {
  constructor(opts = dbDefaultOptions) {
    opts = { ...dbDefaultOptions, ...opts };

    this._knex = knex({ client: 'mysql', connection: opts });
    // console.log(this._knex.schema.connection(this._connection)  );
  }

  get queryBuilder() {
    this._knex.__knex__;
    return this._knex;
  }
}

const db = new Database();
module.exports = { db, Database, execute };
