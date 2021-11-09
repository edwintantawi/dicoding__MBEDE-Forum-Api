const { UsersTableTestHelper } = require('../../../../test/UsersTableTestHelper');
const { container } = require('../../container');
const { pool } = require('../../database/postgres/pool');
const { createServer } = require('../createServer');

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /users', () => {
    it('should response 201 and presisted user', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Academy',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined();
    });
  });
});
