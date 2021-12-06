/* istanbul ignore file */
const jwt = require('@hapi/jwt');
const { pool } = require('../src/Infrastructures/database/postgres/pool');
const {
  JwtTokenManager,
} = require('../src/Infrastructures/security/JwtTokenManager');

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    const query = {
      text: `INSERT INTO authentications
              VALUES ($1)`,
      values: [token],
    };

    await pool.query(query);
  },

  async findToken(token) {
    const query = {
      text: `SELECT token
              FROM authentications
              WHERE token = $1`,
      values: [token],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async createToken({ id = 'user-123' }) {
    const jwtTokenManager = new JwtTokenManager(jwt.token);
    const accessToken = await jwtTokenManager.createAccessToken({ id });
    return accessToken;
  },

  async cleanTable() {
    await pool.query(`DELETE FROM authentications
                      WHERE 1=1`);
  },
};

module.exports = { AuthenticationsTableTestHelper };
