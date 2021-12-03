const {
  CommentRepository,
} = require('../../../Domains/comments/CommentRepository');
const { ThreadRepository } = require('../../../Domains/threads/ThreadRepository');
const { GetThreadDetailUseCase } = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should return thread detail correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: 'thread-123' }));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([{ id: 'comment-001' }]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const thread = await getThreadDetailUseCase.execute(useCasePayload);

    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    );

    expect(thread.id).toEqual(useCasePayload.threadId);
    expect(thread.comments).toStrictEqual([{ id: 'comment-001' }]);
  });
});
