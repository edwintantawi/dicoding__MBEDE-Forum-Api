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
const {
  AuthorizationError,
} = require('../../../Commons/exceptions/AuthorizationError');
const { NotFoundError } = require('../../../Commons/exceptions/NotFoundError');
const { AddedReply } = require('../../../Domains/replies/entities/AddedReply');
const { NewReplies } = require('../../../Domains/replies/entities/NewReplies');
const { pool } = require('../../database/postgres/pool');
const { RepliesRepositoryPostgres } = require('../RepliesRepositoryPostgres');

describe('RepliesRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReplies method', () => {
    it('should presist new replies and return the added replies correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        threadId,
        owner: ownerId,
      });

      const fakeIdGenerator = () => '123';
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const newReplies = new NewReplies({
        threadId,
        commentId,
        owner: ownerId,
        content: 'reply content!',
      });

      const expectedAddedReplies = new AddedReply({
        id: `reply-${fakeIdGenerator()}`,
        content: newReplies.content,
        owner: newReplies.owner,
      });

      const addedReplies = await repliesRepositoryPostgres.addReplies(newReplies);

      expect(addedReplies).toStrictEqual(expectedAddedReplies);
      const replies = await RepliesTableTestHelper.findRepliesById(addedReplies.id);
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual(expectedAddedReplies.id);
    });
  });

  describe('getRepliesByCommentIds method', () => {
    it('should return replies by comment id correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const replyUserId = await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'jack',
      });

      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        owner: ownerId,
        threadId,
      });

      const addedRepliesId = await RepliesTableTestHelper.addReplies({
        commentId,
        owner: replyUserId,
      });

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      const replies = await repliesRepositoryPostgres.getRepliesByCommentIds([
        commentId,
      ]);

      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual(addedRepliesId);
      expect(replies[0].username).toEqual('jack');
    });
  });

  describe('checkReplies method', () => {
    it('should throw error when replies not found', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const replyUserId = await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'jack',
      });

      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        owner: ownerId,
        threadId,
      });

      await RepliesTableTestHelper.addReplies({
        commentId,
        owner: replyUserId,
      });

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      await expect(
        repliesRepositoryPostgres.checkReplies('reply-000', commentId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw error when replies exist', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const replyUserId = await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'jack',
      });

      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        owner: ownerId,
        threadId,
      });

      const replyId = await RepliesTableTestHelper.addReplies({
        commentId,
        owner: replyUserId,
      });

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      await expect(
        repliesRepositoryPostgres.checkReplies(replyId, commentId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('checkRepliesAccess method', () => {
    it('should throw authorization error when cannot access resourse', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const replyUserId = await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'jack',
      });

      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        owner: ownerId,
        threadId,
      });

      const replyId = await RepliesTableTestHelper.addReplies({
        commentId,
        owner: replyUserId,
      });

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      await expect(
        repliesRepositoryPostgres.checkRepliesAccess(replyId, 'user-000')
      ).rejects.toThrow(AuthorizationError);
    });

    it('should not throw authorization error when can access resourse', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const replyUserId = await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'jack',
      });

      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        owner: ownerId,
        threadId,
      });

      const replyId = await RepliesTableTestHelper.addReplies({
        commentId,
        owner: replyUserId,
      });

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      await expect(
        repliesRepositoryPostgres.checkRepliesAccess(replyId, replyUserId)
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteRepliesById method', () => {
    it('should deleted replies correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const replyUserId = await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'jack',
      });

      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        owner: ownerId,
        threadId,
      });

      const replyId = await RepliesTableTestHelper.addReplies({
        commentId,
        owner: replyUserId,
      });

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      await repliesRepositoryPostgres.deleteRepliesById(replyId);

      const replies = await RepliesTableTestHelper.findRepliesById(replyId);

      expect(replies[0].is_delete).toBeTruthy();
    });
  });
});
