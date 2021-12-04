const { AddedReply } = require('../../Domains/replies/entities/AddedReply');
const { RepliesRepository } = require('../../Domains/replies/RepliesRepository');

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplies(newReplies) {
    const { commentId, owner, content } = newReplies;

    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `INSERT INTO replies
              VALUES ($1, $2, $3, $4, $5)
              RETURNING id, content, owner`,
      values: [id, owner, commentId, date, content],
    };

    const { rows } = await this._pool.query(query);

    return new AddedReply({ ...rows[0] });
  }

  async getRepliesByCommentId(id) {
    const query = {
      text: `SELECT replies.id, content, date, users.username
              FROM replies
              LEFT JOIN users
              ON users.id = replies.owner
              WHERE comment_id = $1
              ORDER BY date ASC`,
      values: [id],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = { RepliesRepositoryPostgres };
