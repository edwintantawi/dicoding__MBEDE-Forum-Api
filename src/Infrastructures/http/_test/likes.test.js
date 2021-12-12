const {
  AuthenticationsTableTestHelper,
} = require('../../../../tests/AuthenticationsTableTestHelper');
const {
  CommentsTableTestHelper,
} = require('../../../../tests/CommentsTableTestHelper');
const { LikesTableTestHelper } = require('../../../../tests/LikesTableTestHelper');
const {
  ThreadsTableTestHelper,
} = require('../../../../tests/ThreadsTableTestHelper');
const { UsersTableTestHelper } = require('../../../../tests/UsersTableTestHelper');
const { container } = require('../../container');
const { pool } = require('../../database/postgres/pool');
const { createServer } = require('../createServer');

describe('/likes endpoint', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and like comment correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        threadId,
        owner: ownerId,
      });

      const accessToken = await AuthenticationsTableTestHelper.createToken({
        id: ownerId,
      });

      const server = await createServer({ container });

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      const likes = await LikesTableTestHelper.getAllLikes();

      expect(likes).toHaveLength(1);
      const [like] = likes;
      expect(like.comment_id).toEqual(commentId);
      expect(like.user_id).toEqual(ownerId);
    });

    it('should response 200 and unlike comment correctly when not liked', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        threadId,
        owner: ownerId,
      });
      const likeId = await LikesTableTestHelper.addLike({
        commentId,
        userId: ownerId,
      });

      const accessToken = await AuthenticationsTableTestHelper.createToken({
        id: ownerId,
      });

      const server = await createServer({ container });

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      const likes = await LikesTableTestHelper.findLikeById(likeId);

      expect(likes).toHaveLength(0);
    });
  });
});
