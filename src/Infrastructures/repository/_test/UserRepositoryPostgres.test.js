const { UsersTableTestHelper } = require('../../../../test/UsersTableTestHelper');
const { InvariantError } = require('../../../Commons/exceptions/InvariantError');
const { RegisterUser } = require('../../../Domains/users/entities/RegisterUser');
const {
  RegisteredUser,
} = require('../../../Domains/users/entities/RegisteredUser');
const { pool } = require('../../database/postgres/pool');
const { UserRepositoryPostgres } = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername method', () => {
    it('should throw InvariantError when username not available', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(
        userRepositoryPostgres.verifyAvailableUsername('dicoding')
      ).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username is available', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(
        userRepositoryPostgres.verifyAvailableUsername('dicoding')
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser method', () => {
    it('should presist register user', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Academy',
      });

      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await userRepositoryPostgres.addUser(registerUser);

      const users = await UsersTableTestHelper.findUserById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Academy',
      });

      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: 'user-123',
          username: registerUser.username,
          fullname: registerUser.fullname,
        })
      );
    });
  });
});
