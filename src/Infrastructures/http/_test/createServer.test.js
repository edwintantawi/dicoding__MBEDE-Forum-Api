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

      const server = await createServer({ container });

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

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        username: 'dicoding',
        fullname: 'Dicoding Academy',
      };

      const server = await createServer({ container });

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        "can't create a new user because the required property doesn't exist"
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: ['abc'],
        fullname: 'Dicoding Academy',
      };

      const server = await createServer({ container });

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        "can't create a new user because the data type doesn't match"
      );
    });

    it('should response 400 when username more then 50 character', async () => {
      const requestPayload = {
        username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        password: 'secret_password',
        fullname: 'Dicoding Academy',
      };

      const server = await createServer({ container });

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'cannot create a new user because the username character exceeds the limit'
      );
    });

    it('should response 400 when username contains restricted character', async () => {
      const requestPayload = {
        username: 'di coding',
        password: 'secret_password',
        fullname: 'Dicoding Academy',
      };

      const server = await createServer({ container });

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        "can't create a new user because the username contains restricted characters"
      );
    });

    it('should response 400 when username is not avaiable', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const requestPayload = {
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Academy',
      };

      const server = await createServer({ container });

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username is not available');
    });

    it('should handle server error correctly', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Academy',
      };

      const server = await createServer({});

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(500);
      expect(responseJson.status).toEqual('error');
      expect(responseJson.message).toEqual('server error');
    });

    it('should response 404 when request unregistered routes', async () => {
      const server = await createServer({});

      const response = await server.inject({
        method: 'POST',
        url: '/unregisteredroute',
      });

      expect(response.statusCode).toEqual(404);
    });
  });
});
