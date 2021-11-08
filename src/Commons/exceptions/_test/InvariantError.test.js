const { InvariantError } = require('../InvariantError');

describe('InvariantError', () => {
  it('should create an error correctlt', () => {
    const invariantError = new InvariantError('an invariant error');

    expect(invariantError.name).toEqual('InvariantError');
    expect(invariantError.statusCode).toEqual(400);
    expect(invariantError.message).toEqual('an invariant error');
  });
});
