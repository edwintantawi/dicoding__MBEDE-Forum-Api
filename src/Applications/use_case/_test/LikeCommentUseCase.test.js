const {
  CommentRepositoryPostgres,
} = require('../../../Infrastructures/repository/CommentRepositoryPostgres');
const {
  LikeRepositoryPostgres,
} = require('../../../Infrastructures/repository/LikeRepositoryPostgres');
const { LikeCommentUseCase } = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should handle like correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      credentialId: 'user-123',
    };

    const mockCommentRepository = new CommentRepositoryPostgres();
    const mockLikeRepository = new LikeRepositoryPostgres();

    mockCommentRepository.checkComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.isLiked = jest.fn(() => Promise.resolve(null));
    mockLikeRepository.like = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await likeCommentUseCase.execute(useCasePayload);

    expect(mockCommentRepository.checkComment).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    );
    expect(mockLikeRepository.isLiked).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.credentialId
    );
    expect(mockLikeRepository.like).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.credentialId
    );
  });

  it('should handle unlike correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      credentialId: 'user-123',
    };

    const mockCommentRepository = new CommentRepositoryPostgres();
    const mockLikeRepository = new LikeRepositoryPostgres();

    mockCommentRepository.checkComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.isLiked = jest.fn(() => Promise.resolve('like-123'));
    mockLikeRepository.unlike = jest.fn(() => Promise.resolve());
    mockLikeRepository.like = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await likeCommentUseCase.execute(useCasePayload);

    expect(mockCommentRepository.checkComment).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    );
    expect(mockLikeRepository.isLiked).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.credentialId
    );
    expect(mockLikeRepository.unlike).toBeCalledWith('like-123');
    expect(mockLikeRepository.like).not.toBeCalled();
  });
});
