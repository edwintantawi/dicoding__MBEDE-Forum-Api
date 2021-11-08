const { InvariantError } = require('../../Commons/exceptions/InvariantError');
const { RegisteredUser } = require('../../Domains/users/entities/RegisteredUser');
const { UserRepository } = require('../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: `SELECT username
              FROM users
              WHERE username = $1`,
      values: [username],
    };

    const { rowCount } = await this._pool.query(query);

    if (rowCount) throw new InvariantError('username is not available');
  }

  async addUser(registerUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO users
              VALUES ($1, $2, $3, $4)
              RETURNING id, username, fullname`,
      values: [id, username, password, fullname],
    };

    const { rows } = await this._pool.query(query);

    return new RegisteredUser({ ...rows[0] });
  }
}

module.exports = { UserRepositoryPostgres };
