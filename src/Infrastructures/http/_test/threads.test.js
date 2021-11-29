const {
  AuthenticationsTableTestHelper,
} = require('../../../../tests/AuthenticationsTableTestHelper');
const {
  ThreadsTableTestHelper,
} = require('../../../../tests/ThreadsTableTestHelper');
const { UsersTableTestHelper } = require('../../../../tests/UsersTableTestHelper');
const { container } = require('../../container');
const { pool } = require('../../database/postgres/pool');
const { createServer } = require('../createServer');

describe('/threads endpoint', () => {
  // beforeEach(async () => {
  //   await UsersTableTestHelper.addUser({
  //     username: 'dicoding',
  //     password: 'secret_password',
  //   });
  // });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted threads', async () => {
      const registerPayload = {
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };

      const loginPayload = {
        username: 'dicoding',
        password: 'secret_password',
      };

      const threadPayload = {
        title: 'thread title',
        body: 'thread body',
      };

      const server = await createServer({ container });

      // register user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerPayload,
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // post thread
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      const result = await ThreadsTableTestHelper.findThreadById(
        responseJson.data.addedThread.id
      );

      expect(response.statusCode).toEqual(201);
      expect(result).toHaveLength(1);
    });
  });
});
