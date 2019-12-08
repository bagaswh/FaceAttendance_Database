const Model = require('./base');
const { db, execute } = require('../db');

class User extends Model {
  constructor() {
    super('users');
  }

  createAttendanceTable(date) {
    return execute(
      db.queryBuilder.schema.hasTable('attendance_' + date).then(exists => {
        if (exists) return null;

        return execute(
          db.queryBuilder.schema.createTable('attendance_' + date, table => {
            table.increments();
            table.boolean('attended');
            table.integer('attending_time');
            table.integer('user_id');
          })
        );
      })
    );
  }

  async getDateList() {
    // const regex = /^attendance/;
    return (await execute(db.queryBuilder.schema.raw('SHOW TABLES')))[0]
      .filter(table => {
        if (table.Tables_in_face_recognition_attendance.match('attendance')) {
          return table;
        }
      })
      .map(table => {
        return table.Tables_in_face_recognition_attendance;
      });
  }

  getCurrentAttendanceTableName() {
    const date = new Date()
      .toDateString()
      .split(' ')
      .join('_');

    return 'attendance_' + date;
  }

  async updateAttendance(id, tableName, isAttending) {
    const data = await db
      .queryBuilder(tableName)
      .select('*')
      .where({ user_id: id });

    if (!data.length) {
      return await execute(
        db
          .queryBuilder(date)
          .insert({ attended: isAttending, attending_time: new Date().getTime(), user_id: id })
      );
    }

    return Promise.resolve(1);
    /* return execute(
      db
        .queryBuilder(date)
        .update({ attended: isAttending, attending_time: new Date().getTime() })
        .where({ user_id: id })
    ); */
  }

  reset() {
    return execute(db.queryBuilder(this.getCurrentAttendanceTableName()).truncate());
  }
}

const user = new User();
module.exports = { User: user };
