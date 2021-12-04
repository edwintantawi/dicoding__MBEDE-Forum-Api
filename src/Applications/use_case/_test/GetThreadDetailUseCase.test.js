const { ThreadRepository } = require('../../../Domains/threads/ThreadRepository');
const { GetThreadDetailUseCase } = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should return thread detail correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: 'thread-123' }));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
    });

    const thread = await getThreadDetailUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    );

    expect(thread.id).toEqual(useCasePayload.threadId);
  });
});
