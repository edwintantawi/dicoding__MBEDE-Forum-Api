const { UserRepository } = require('../UserRepository');

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const userRepository = new UserRepository();

    await expect(userRepository.addUser({})).rejects.toThrowError(
      'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );

    await expect(
      userRepository.verifyAvailableUsername('dicoding')
    ).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
      userRepository.getPasswordByUsername('dicoding')
    ).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(userRepository.getIdByUsername('dicoding')).rejects.toThrowError(
      'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
