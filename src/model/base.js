const { db, execute } = require('../db');

class Model {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async getAll() {
    return await execute(db.queryBuilder(this.tableName).select('*'));
  }

  async get(cols, where = {}) {
    if (!(cols instanceof Array)) {
      cols = [cols];
    }

    return await execute(
      db
        .queryBuilder(this.tableName)
        .select(cols)
        .where(opts)
    );
  }

  async insert(data) {
    return await execute(db.queryBuilder(this.tableName).insert(data));
  }
}

module.exports = Model;
