const { db, execute } = require('./db');
const { diff } = require('./utils');
const { User } = require('./model/user');

class DBPoller {
  constructor(dbConnection, pollingInterval, table, command, isRaw, opts = { debug: false }) {
    this.__db = dbConnection;
    this.__table = table;

    this.__opts = opts;

    this.__command = command;
    this.__isRaw = isRaw;

    this.__intervalId = null;

    this.__previousState = null;
    this.__diff = null;

    this.__onChangeListeners = [];

    this.__startPolling(pollingInterval);
  }

  __startPolling(interval = 1000) {
    this.__intervalId = setInterval(async () => {
      let data;
      if (this.__isRaw) {
        data = (await execute(this.__command))[0];
      } else {
        data = await execute(this.__command);
      }

      if (this.__opts.debug) {
        console.log('polled');
      }

      if (!this.__previousState) {
        this.__previousState = data;
      } else if ((this.__diff = diff(this.__previousState, data))) {
        this.__previousState = data;
        this.__executeOnChange();
      }
    }, interval);
  }

  __executeOnChange() {
    this.__onChangeListeners.forEach(listener => {
      listener(this.__previousState, this.__diff);
    });
  }

  __stopPolling() {
    clearInterval(this.__intervalId);
  }

  stop() {
    this.__stopPolling();
  }

  setTableName(table) {
    this.stopPolling();
    this.__table = table;
    this.__startPolling();
  }

  setCommand(command, isRaw) {
    this.stopPolling();
    this.__command = command;
    this.__isRaw = isRaw;
    this.__startPolling();
  }

  onChange(cb) {
    if (typeof cb == 'function') {
      this.__onChangeListeners.push(cb);
    }
  }
}

const tableName = User.getCurrentAttendanceTableName();
const command = db.queryBuilder.raw(`
  SELECT users.id, users.fullname, ${tableName}.attended, ${tableName}.attending_time FROM users
  LEFT JOIN ${tableName} ON users.id=${tableName}.user_id WHERE users.id BETWEEN 17059 AND 17090
  UNION
  SELECT users.id, users.fullname, ${tableName}.attended, ${tableName}.attending_time FROM users
  RIGHT JOIN ${tableName} ON users.id=${tableName}.user_id WHERE users.id BETWEEN 17059 AND 17090
  ORDER BY id ASC
`);
const poller = new DBPoller(db, 1000, tableName, command, true);
module.exports = { DBPoller, poller };
