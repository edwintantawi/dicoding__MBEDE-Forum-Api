/* eslint-disable camelcase */
class RepliesDetail {
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
      this.content = '**balasan telah dihapus**';
    } else {
      this.content = content;
    }
  }

  _verifyPayload(payload) {
    const { id, username, date, content, is_delete } = payload;

    if (!id || !username || !date || !content || is_delete === undefined) {
      throw new Error('REPLIES_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof content !== 'string' ||
      typeof is_delete !== 'boolean'
    ) {
      throw new Error('REPLIES_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = { RepliesDetail };
