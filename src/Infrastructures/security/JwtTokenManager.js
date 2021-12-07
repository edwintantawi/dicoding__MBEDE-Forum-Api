const {
  AuthenticationTokenManager,
} = require('../../Applications/security/AuthenticationTokenManager');
const { InvariantError } = require('../../Commons/exceptions/InvariantError');
const { getEnv } = require('../../Commons/helpers/getEnv');

class JwtTokenManager extends AuthenticationTokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  async createAccessToken(payload) {
    return this._jwt.generate(payload, getEnv('ACCESS_TOKEN_KEY'));
  }

  async createRefreshToken(payload) {
    return this._jwt.generate(payload, getEnv('REFRESH_TOKEN_KEY'));
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.decode(token);
      this._jwt.verify(artifacts, getEnv('REFRESH_TOKEN_KEY'));
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token) {
    const artifacts = this._jwt.decode(token);
    return artifacts.decoded.payload;
  }
}

module.exports = { JwtTokenManager };
