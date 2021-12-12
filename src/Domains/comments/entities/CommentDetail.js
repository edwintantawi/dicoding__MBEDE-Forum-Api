/* eslint-disable camelcase */
class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);
    this._handleDeletedContent(payload);
    const { id, username, date, like_count } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.likeCount = like_count;
  }

  _handleDeletedContent(payload) {
    const { content, is_delete } = payload;
    this.content = content;

    if (is_delete) {
      this.content = '**komentar telah dihapus**';
    }
  }

  _verifyPayload(payload) {
    const { id, username, date, content, is_delete, like_count } = payload;

    if (!id || !username || !date || !content || is_delete === undefined) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'object' ||
      typeof content !== 'string' ||
      typeof is_delete !== 'boolean' ||
      typeof like_count !== 'number'
    ) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = { CommentDetail };
