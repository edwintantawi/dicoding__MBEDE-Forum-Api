const {
  AuthenticationsTableTestHelper,
} = require('../../../../tests/AuthenticationsTableTestHelper');
const {
  CommentsTableTestHelper,
} = require('../../../../tests/CommentsTableTestHelper');
const {
  RepliesTableTestHelper,
} = require('../../../../tests/RepliesTableTestHelper');
const {
  ThreadsTableTestHelper,
} = require('../../../../tests/ThreadsTableTestHelper');
const { UsersTableTestHelper } = require('../../../../tests/UsersTableTestHelper');
const { container } = require('../../container');
const { pool } = require('../../database/postgres/pool');
const { createServer } = require('../createServer');

describe('/replies endpoint', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTabel();
    await CommentsTableTestHelper.cleanTabel();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and presisted replies', async () => {
      const server = await createServer({ container });

      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        threadId,
        owner: ownerId,
      });
      const accessToken = await AuthenticationsTableTestHelper.createToken({
        id: ownerId,
      });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: 'my thread comment replies' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const reponseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(reponseJson.data.addedReply.content).toStrictEqual(
        'my thread comment replies'
      );
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete replies correctly', async () => {
      const server = await createServer({ container });

      const ownerId = await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        owner: ownerId,
      });
      const commentId = await CommentsTableTestHelper.addComment({
        threadId,
        owner: ownerId,
      });
      const replyId = await RepliesTableTestHelper.addReplies({
        commentId,
        owner: ownerId,
      });
      const accessToken = await AuthenticationsTableTestHelper.createToken({
        id: ownerId,
      });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(response.statusCode).toEqual(200);
    });
  });
});
