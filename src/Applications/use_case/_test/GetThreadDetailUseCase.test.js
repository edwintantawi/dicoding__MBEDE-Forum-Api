const {
  CommentRepository,
} = require('../../../Domains/comments/CommentRepository');
const { RepliesRepository } = require('../../../Domains/replies/RepliesRepository');
const { ThreadRepository } = require('../../../Domains/threads/ThreadRepository');
const { GetThreadDetailUseCase } = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should return thread detail correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    mockThreadRepository.getThreadById = jest.fn(() =>
      Promise.resolve({ id: 'thread-123' })
    );

    mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
      Promise.resolve([{ id: 'comment-123' }])
    );

    mockRepliesRepository.getRepliesByCommentId = jest.fn(() =>
      Promise.resolve([
        {
          id: 'reply-123',
          username: 'dicoding',
          date: new Date(),
          content: 'replies content',
          is_delete: false,
          comment_id: 'comment-123',
        },
      ])
    );

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    const thread = await getThreadDetailUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    );

    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId
    );

    expect(mockRepliesRepository.getRepliesByCommentId).toBeCalledWith([
      'comment-123',
    ]);

    console.log(thread);

    expect(thread.id).toEqual(useCasePayload.threadId);
    expect(thread.comments).toHaveLength(1);
    expect(thread.comments[0].id).toEqual('comment-123');
    expect(thread.comments[0].replies).toHaveLength(1);
    expect(thread.comments[0].replies[0].id).toEqual('reply-123');
  });
});
