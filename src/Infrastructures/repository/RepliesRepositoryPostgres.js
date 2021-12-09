const {
  AuthorizationError,
} = require('../../Commons/exceptions/AuthorizationError');
const { NotFoundError } = require('../../Commons/exceptions/NotFoundError');
const { AddedReply } = require('../../Domains/replies/entities/AddedReply');
// const { RepliesDetail } = require('../../Domains/replies/entities/RepliesDetail');
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

    const query = {
      text: `INSERT INTO
                replies (id, owner, comment_id, content)
              VALUES ($1, $2, $3, $4)
              RETURNING id, content, owner`,
      values: [id, owner, commentId, content],
    };

    const { rows } = await this._pool.query(query);

    return new AddedReply({ ...rows[0] });
  }

  async getRepliesByCommentId(commentIds) {
    const query = {
      text: `SELECT replies.*, users.username
              FROM replies
              LEFT JOIN users
              ON users.id = replies.owner
              WHERE comment_id = ANY($1::text[])
              ORDER BY date ASC`,
      values: [commentIds],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

  async checkReplies(replyId, commentId) {
    const query = {
      text: `SELECT id
              FROM replies
              WHERE id = $1 AND
                    comment_id = $2`,
      values: [replyId, commentId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('replies not found');
    }
  }

  async checkRepliesAccess(replyId, credentialId) {
    const query = {
      text: `SELECT id
              FROM replies
              WHERE id = $1 AND
                    owner = $2`,
      values: [replyId, credentialId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError('not have access to this resourses');
    }
  }

  async deleteRepliesById(replyId) {
    const query = {
      text: `UPDATE replies
              SET is_delete = true
              WHERE id = $1`,
      values: [replyId],
    };

    await this._pool.query(query);
  }
}

module.exports = { RepliesRepositoryPostgres };
