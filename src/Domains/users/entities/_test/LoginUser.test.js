const { LoginUser } = require('../LoginUser');

describe('LoginUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
    };

    expect(() => new LoginUser(payload)).toThrowError(
      'LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      username: true,
      password: 'secret_password',
    };

    expect(() => new LoginUser(payload)).toThrowError(
      'LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create loginUser object correctly', () => {
    const payload = {
      username: 'dicoding',
      password: 'secret_password',
    };

    const loginUser = new LoginUser(payload);

    expect(loginUser.username).toEqual(payload.username);
    expect(loginUser.password).toEqual(payload.password);
  });
});
