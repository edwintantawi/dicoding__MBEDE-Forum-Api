// istanbul ignore file
const { pool } = require('../src/Infrastructures/database/postgres/pool');

class ThreadsTableTestHelper {
  static async addThread({
    id = 'thread-123',
    title = 'dicoding thread',
    body = 'dicoding thread body',
    date = '2021-08-08T07:19:09.775Z',
    owner = 'user-123',
  }) {
    const query = {
      text: `INSERT INTO threads
              VALUES ($1, $2, $3, $4, $5)
              RETURNING *`,
      values: [id, title, body, date, owner],
    };

    const { rows } = await pool.query(query);
    return rows[0].id;
  }

  static async findThreadById(id) {
    const query = {
      text: `SELECT *
              FROM threads
              WHERE id = $1`,
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows;
  }

  static async cleanTable() {
    await pool.query(`DELETE FROM threads
                      WHERE 1=1`);
  }
}

module.exports = { ThreadsTableTestHelper };
