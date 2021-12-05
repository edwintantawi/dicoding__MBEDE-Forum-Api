const { DeleteRepliesUseCase } = require('../DeleteRepliesUseCase');
const {
  CommentRepositoryPostgres,
} = require('../../../Infrastructures/repository/CommentRepositoryPostgres');
const {
  RepliesRepositoryPostgres,
} = require('../../../Infrastructures/repository/RepliesRepositoryPostgres');

describe('DeleteRepliesUseCase', () => {
  it('should deleted replies correctly', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      credentialId: 'user-123',
      replyId: 'reply-123',
    };

    const mockCommentRepository = new CommentRepositoryPostgres();
    const mockRepliesRepository = new RepliesRepositoryPostgres();

    mockCommentRepository.checkComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockRepliesRepository.checkReplies = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockRepliesRepository.checkRepliesAccess = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockRepliesRepository.deleteRepliesById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteRepliesUseCase = new DeleteRepliesUseCase({
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    await deleteRepliesUseCase.execute(useCasePayload);

    expect(mockCommentRepository.checkComment).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    );
    expect(mockRepliesRepository.checkReplies).toBeCalledWith(
      useCasePayload.replyId,
      useCasePayload.commentId
    );
    expect(mockRepliesRepository.checkRepliesAccess).toBeCalledWith(
      useCasePayload.replyId,
      useCasePayload.credentialId
    );
    expect(mockRepliesRepository.deleteRepliesById).toBeCalledWith(
      useCasePayload.replyId
    );
  });
});
