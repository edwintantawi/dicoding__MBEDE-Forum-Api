/* istanbul ignore file */
const { pool } = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    threadId,
    owner,
    id = 'comment-123',
    date = '2021-08-08T07:19:09.775Z',
    content = 'thread comment content',
  }) {
    const query = {
      text: `INSERT INTO comments 
              VALUES ($1, $2, $3, $4, $5)
              RETURNING id`,
      values: [id, owner, threadId, date, content],
    };

    const { rows } = await pool.query(query);
    return rows[0].id;
  },

  async findCommentById(id) {
    const query = {
      text: `SELECT * 
              FROM comments
              WHERE id = $1`,
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async deleteCommentById(id) {
    const query = {
      text: `UPDATE comments
              SET is_delete = true
              WHERE id = $1`,
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTabel() {
    await pool.query(`DELETE FROM comments
                      WHERE 1=1`);
  },
};

module.exports = { CommentsTableTestHelper };
