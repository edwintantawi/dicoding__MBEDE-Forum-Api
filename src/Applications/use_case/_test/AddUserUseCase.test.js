const {
  RegisteredUser,
} = require('../../../Domains/users/entities/RegisteredUser');
const { UserRepository } = require('../../../Domains/users/UserRepository');
const { PasswordHash } = require('../../security/PasswordHash');
const { RegisterUser } = require('../../../Domains/users/entities/RegisterUser');
const { AddUserUseCase } = require('../AddUserUseCase');

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret_password',
      fullname: 'Dicoding Academy',
    };

    const expectRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.verifyAvailableUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest
      .fn()
      .mockImplementation(() => 'encrypted_password');
    mockUserRepository.addUser = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectRegisteredUser));

    const getAddUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    const registeredUser = await getAddUserUseCase.execute(useCasePayload);

    expect(registeredUser).toStrictEqual(expectRegisteredUser);
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(
      useCasePayload.username
    );
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(
      new RegisterUser({
        username: useCasePayload.username,
        password: 'encrypted_password',
        fullname: useCasePayload.fullname,
      })
    );
  });
});
