/* eslint-disable camelcase */
class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);
    this._handleDeletedContent(payload);
    const { id, username, date } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
  }

  _handleDeletedContent(payload) {
    const { content, is_delete } = payload;

    if (is_delete) {
      this.content = '**komentar telah dihapus**';
    } else {
      this.content = content;
    }
  }

  _verifyPayload(payload) {
    const { id, username, date, content, is_delete } = payload;

    if (!id || !username || !date || !content || is_delete === undefined) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof content !== 'string' ||
      typeof is_delete !== 'boolean'
    ) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = { CommentDetail };
