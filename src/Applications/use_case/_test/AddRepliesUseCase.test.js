const {
  CommentRepository,
} = require('../../../Domains/comments/CommentRepository');
const { AddedReply } = require('../../../Domains/replies/entities/AddedReply');
const { NewReplies } = require('../../../Domains/replies/entities/NewReplies');
const { RepliesRepository } = require('../../../Domains/replies/RepliesRepository');
const { AddRepliesUseCase } = require('../AddRepliesUseCase');

describe('AddRepliesUseCase', () => {
  it('should orchestrating the add replies action correctly', async () => {
    const useCasePayload = new NewReplies({
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'the replies content',
      owner: 'user-123',
    });

    const expectedAddedReplies = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    mockCommentRepository.checkCommentAccess = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockRepliesRepository.addReplies = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReplies));

    const addRepliesUseCase = new AddRepliesUseCase({
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    const addedReplies = await addRepliesUseCase.execute(useCasePayload);

    expect(addedReplies).toStrictEqual(expectedAddedReplies);
    expect(mockCommentRepository.checkCommentAccess).toBeCalledWith({
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId,
      credentialId: useCasePayload.owner,
    });
    expect(mockRepliesRepository.addReplies).toBeCalledWith(useCasePayload);
  });
});
