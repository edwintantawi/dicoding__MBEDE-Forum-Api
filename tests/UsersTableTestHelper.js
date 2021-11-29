// istanbul ignore file
const { pool } = require('../src/Infrastructures/database/postgres/pool');

class UsersTableTestHelper {
  static async addUser({
    id = 'user-123',
    username = 'dicoding',
    password = 'secret_password',
    fullname = 'Dicoding Academy',
  }) {
    const query = {
      text: `INSERT INTO users
              VALUES ($1, $2, $3, $4)
              RETURNING id`,
      values: [id, username, password, fullname],
    };

    const { rows } = await pool.query(query);
    return rows[0].id;
  }

  static async findUserById(id) {
    const query = {
      text: `SELECT *
              FROM users
              WHERE id = $1`,
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows;
  }

  static async cleanTable() {
    await pool.query('TRUNCATE TABLE users, threads');
  }
}

module.exports = { UsersTableTestHelper };
