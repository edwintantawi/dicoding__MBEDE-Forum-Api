const { AddedReply } = require('../AddedReply');

describe('AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
    };

    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      content: 'reply content',
      owner: ['user-123'],
    };

    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create AddedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'reply content',
      owner: 'user-123',
    };

    const addedReplies = new AddedReply(payload);

    expect(addedReplies.id).toEqual(payload.id);
    expect(addedReplies.content).toEqual(payload.content);
    expect(addedReplies.owner).toEqual(payload.owner);
  });
});
