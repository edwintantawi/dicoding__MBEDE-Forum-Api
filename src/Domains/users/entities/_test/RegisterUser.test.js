const { RegisterUser } = require('../RegisterUser');

describe('RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
      fullname: 'Dicoding Academy',
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      username: 'dicoding',
      fullname: 'Dicoding Academy',
      password: ['secret_password'],
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when username contains more then 50 character', () => {
    const payload = {
      username: 'dicodingdicodingdicodingdicodingdicodingdicodingdin',
      fullname: 'Dicoding Academy',
      password: 'secret_password',
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.USERNAME_LIMIT_CHAR'
    );
  });

  it('should throw error when username contains restricted character', () => {
    const payload = {
      username: 'di coding',
      fullname: 'Dicoding Academy',
      password: 'secret_password',
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHAR'
    );
  });

  it('should create registerUser object correctly', () => {
    const payload = {
      username: 'dicoding',
      password: 'secret_password',
      fullname: 'Dicoding Academy',
    };

    const registerUser = new RegisterUser(payload);

    expect(registerUser.username).toEqual(payload.username);
    expect(registerUser.password).toEqual(payload.password);
    expect(registerUser.fullname).toEqual(payload.fullname);
  });
});
