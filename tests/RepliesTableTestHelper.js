/* istanbul ignore file */
const { pool } = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReplies({
    id = 'reply-123',
    owner,
    commentId,
    date = new Date().toISOString(),
    content = 'reply content',
    isDelete = false,
  }) {
    const query = {
      text: `INSERT INTO replies
              VALUES ($1, $2, $3, $4, $5, $6)
              RETURNING id`,
      values: [id, owner, commentId, date, content, isDelete],
    };

    const { rows } = await pool.query(query);
    return rows[0].id;
  },

  async findRepliesById(id) {
    const query = {
      text: `SELECT *
              FROM replies
              WHERE id = $1`,
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows;
  },
  async cleanTabel() {
    await pool.query(`DELETE FROM replies
                      WHERE 1=1`);
  },
};

module.exports = { RepliesTableTestHelper };
