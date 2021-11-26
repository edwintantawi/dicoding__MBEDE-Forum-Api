const { NewAuthentication } = require('../NewAuthentication');

describe('NewAuthentication entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      accessToken: 'accessToken',
    };

    expect(() => new NewAuthentication(payload)).toThrowError(
      'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when paylod not meet data type specification', () => {
    const payload = {
      accessToken: true,
      refreshToken: 'refreshToken',
    };

    expect(() => new NewAuthentication(payload)).toThrowError(
      'NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create NewAuthentication object correctly', () => {
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    const newAuthentication = new NewAuthentication(payload);

    expect(newAuthentication.accessToken).toEqual(payload.accessToken);
    expect(newAuthentication.refreshToken).toEqual(payload.refreshToken);
  });
});
