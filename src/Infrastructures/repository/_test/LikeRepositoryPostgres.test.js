const {
  CommentsTableTestHelper,
} = require('../../../../tests/CommentsTableTestHelper');
const { LikesTableTestHelper } = require('../../../../tests/LikesTableTestHelper');
const {
  ThreadsTableTestHelper,
} = require('../../../../tests/ThreadsTableTestHelper');
const { UsersTableTestHelper } = require('../../../../tests/UsersTableTestHelper');
const { pool } = require('../../database/postgres/pool');
const { LikeRepositoryPostgres } = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTabel();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('like method', () => {
    it('should presist add like correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        threadId,
        owner: ownerId,
      });
      const fakeIdGenerator = () => '123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await likeRepositoryPostgres.like(commentId, ownerId);

      const likes = await LikesTableTestHelper.findLikeById(
        `like-${fakeIdGenerator()}`
      );

      const [like] = likes;
      expect(likes).toHaveLength(1);
      expect(like.comment_id).toEqual(commentId);
      expect(like.user_id).toEqual(ownerId);
    });
  });

  describe('unlike method', () => {
    it('should delete like correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        threadId,
        owner: ownerId,
      });
      const likeId = await LikesTableTestHelper.addLike({ commentId, ownerId });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await likeRepositoryPostgres.unlike(likeId);

      const likes = await LikesTableTestHelper.findLikeById(likeId);

      expect(likes).toHaveLength(0);
    });
  });

  describe('isLiked method', () => {
    it('should return null when like is not exist', async () => {
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

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const isLiked = await likeRepositoryPostgres.isLiked(commentId, ownerId);

      expect(isLiked).toBeFalsy();
    });

    it('should return like id when like is exist', async () => {
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
      const likeId = await LikesTableTestHelper.addLike({
        commentId,
        userId: ownerId,
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const isLiked = await likeRepositoryPostgres.isLiked(commentId, ownerId);

      expect(isLiked).toEqual(likeId);
    });
  });
});
