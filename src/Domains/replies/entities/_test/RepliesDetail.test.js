const { RepliesDetail } = require('../RepliesDetail');

describe('RepliesDetail entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: new Date('2021-08-08T07:22:33.555Z'),
      content: 'reply content',
    };

    expect(() => new RepliesDetail(payload)).toThrowError(
      'REPLIES_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: new Date('2021-08-08T07:22:33.555Z'),
      content: 'reply content',
      is_delete: 'true',
    };

    expect(() => new RepliesDetail(payload)).toThrowError(
      'REPLIES_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should transform content to deleted when is_delete is true', () => {
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: new Date('2021-08-08T07:22:33.555Z'),
      content: 'reply content',
      is_delete: true,
    };

    const repliesDetail = new RepliesDetail(payload);

    expect(repliesDetail.content).toBe('**balasan telah dihapus**');
  });

  it('should create repliesDetail object correctly', () => {
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: new Date('2021-08-08T07:22:33.555Z'),
      content: 'reply content',
      is_delete: false,
    };

    const repliesDetail = new RepliesDetail(payload);

    expect(repliesDetail.id).toEqual(payload.id);
    expect(repliesDetail.username).toEqual(payload.username);
    expect(repliesDetail.date).toEqual(payload.date);
    expect(repliesDetail.content).toEqual(payload.content);
    expect(repliesDetail).not.toHaveProperty('is_delete');
  });
});
