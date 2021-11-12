const { PasswordHash } = require('../PasswordHash');

describe('PasswordHash interface', () => {
  it('should throw errr when invoke abstract behavior', async () => {
    const passwordHash = new PasswordHash();

    await expect(passwordHash.hash('secret_password')).rejects.toThrowError(
      'PASSWORD_HASH.METHOD_NOT_IMPLEMENTED'
    );
  });
});
