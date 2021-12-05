const {
  CommentRepository,
} = require('../../../Domains/comments/CommentRepository');
const { RepliesRepository } = require('../../../Domains/replies/RepliesRepository');
const { GetCommentsUseCase } = require('../GetCommentsUseCase');

describe('GetCommentsUseCase', () => {
  it('should return comments correctly', async () => {
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([{ id: 'comment-001' }]));
    mockRepliesRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));

    const getCommentDetailUseCase = new GetCommentsUseCase({
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    const comments = await getCommentDetailUseCase.execute({
      threadId: 'thread-123',
    });

    expect(comments).toHaveLength(1);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      'thread-123'
    );
    expect(mockRepliesRepository.getRepliesByCommentId).toBeCalledWith(
      'comment-001'
    );
  });
});
