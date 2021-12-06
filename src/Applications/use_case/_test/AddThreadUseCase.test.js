const { AddedThread } = require('../../../Domains/threads/entities/AddedThread');
const { NewThread } = require('../../../Domains/threads/entities/NewThread');
const { ThreadRepository } = require('../../../Domains/threads/ThreadRepository');
const { AddThreadUseCase } = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'dicoding thread',
      body: 'dicoding thread body',
      owner: 'user-123',
    };

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    const mockRepository = new ThreadRepository();

    mockRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockRepository,
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockRepository.addThread).toBeCalledWith(new NewThread(useCasePayload));
  });
});
