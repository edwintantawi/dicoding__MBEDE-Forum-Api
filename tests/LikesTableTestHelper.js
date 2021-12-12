/* istanbul ignore file */

const { pool } = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123',
    commentId = 'comment-123',
    userId = 'user-123',
  }) {
    const query = {
      text: `INSERT INTO likes
              VALUES($1, $2, $3)
              RETURNING id`,
      values: [id, commentId, userId],
    };

    const { rows } = await pool.query(query);
    return rows[0].id;
  },

  async findLikeById(id) {
    const query = {
      text: `SELECT *
              FROM likes
              WHERE id = $1`,
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async getAllLikes() {
    const { rows } = await pool.query('SELECT * FROM likes');
    return rows;
  },

  async cleanTable() {
    await pool.query(`DELETE FROM likes
                      WHERE 1=1`);
  },
};

module.exports = { LikesTableTestHelper };
