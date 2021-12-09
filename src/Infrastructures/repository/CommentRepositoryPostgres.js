const {
  AuthorizationError,
} = require('../../Commons/exceptions/AuthorizationError');
const { NotFoundError } = require('../../Commons/exceptions/NotFoundError');
const { CommentRepository } = require('../../Domains/comments/CommentRepository');
const { AddedComment } = require('../../Domains/comments/entities/AddedComment');
const { CommentDetail } = require('../../Domains/comments/entities/CommentDetail');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO
                comments (id, owner, thread_id, content)
              VALUES ($1, $2, $3, $4)
              RETURNING id, content, owner`,
      values: [id, owner, threadId, content],
    };

    const { rows } = await this._pool.query(query);

    return new AddedComment({ ...rows[0] });
  }

  async checkCommentAccess(ids) {
    const { commentId, threadId, credentialId } = ids;

    const query = {
      text: `SELECT id, owner, thread_id
              FROM comments
              WHERE id = $1 AND thread_id = $2`,
      values: [commentId, threadId],
    };

    const { rows, rowCount: isExist } = await this._pool.query(query);

    if (!isExist) {
      throw new NotFoundError('comment not found');
    }

    const comment = rows[0];

    if (comment.owner !== credentialId) {
      throw new AuthorizationError('not have access to this resourses');
    }
  }

  async deleteCommentById(id) {
    const query = {
      text: `UPDATE comments
              SET is_delete = true
              WHERE id = $1
              RETURNING id`,
      values: [id],
    };
    const { rows } = await this._pool.query(query);

    return rows[0].id;
  }

  async getCommentsByThreadId(id) {
    const query = {
      text: `SELECT comments.id, users.username, date, content, is_delete
              FROM comments
              LEFT JOIN users
              ON users.id = comments.owner
              WHERE thread_id = $1
              ORDER BY date ASC`,
      values: [id],
    };
    const { rows } = await this._pool.query(query);
    return rows.map((row) => new CommentDetail({ ...row }));
  }

  async checkComment(commentId, threadId) {
    const query = {
      text: `SELECT id
              FROM comments
              WHERE id = $1 AND
                    thread_id = $2`,
      values: [commentId, threadId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('comment not found');
    }
  }
}

module.exports = { CommentRepositoryPostgres };
