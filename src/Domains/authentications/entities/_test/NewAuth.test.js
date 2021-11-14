const { NewAuth } = require('../NewAuth');

describe('NewAuth entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      accessToken: 'accessToken',
    };

    expect(() => new NewAuth(payload)).toThrowError(
      'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when paylod not meet data type specification', () => {
    const payload = {
      accessToken: true,
      refreshToken: 'refreshToken',
    };

    expect(() => new NewAuth(payload)).toThrowError(
      'NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create newAuth object correctly', () => {
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    const newAuth = new NewAuth(payload);

    expect(newAuth.accessToken).toEqual(payload.accessToken);
    expect(newAuth.refreshToken).toEqual(payload.refreshToken);
  });
});
