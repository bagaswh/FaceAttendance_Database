const Model = require('./base');
const { db, execute } = require('../db');

class Face extends Model {
  constructor() {
    super('faces');
  }
}

const face = new Face();
module.exports = { Face: face };
