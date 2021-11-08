const bcrypt = require('bcrypt');
const { BcryptPasswordHash } = require('../BcryptPasswordHash');

describe('BcryptPasswordHash', () => {
  describe('hash method', () => {
    it('should encrypt password correctly', async () => {
      const password = 'secure_password';
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      const spyHash = jest.spyOn(bcrypt, 'hash');
      const encryptedPassword = await bcryptPasswordHash.hash(password);

      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual(password);
      expect(spyHash).toBeCalledWith(password, 10);
    });
  });
});
