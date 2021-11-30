const {
  CommentsTableTestHelper,
} = require('../../../../tests/CommentsTableTestHelper');
const {
  ThreadsTableTestHelper,
} = require('../../../../tests/ThreadsTableTestHelper');
const { UsersTableTestHelper } = require('../../../../tests/UsersTableTestHelper');
const { AddedComment } = require('../../../Domains/comments/entities/AddedComment');
const { pool } = require('../../database/postgres/pool');
const { CommentRepositoryPostgres } = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTabel();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment method', () => {
    it('should presist new comment and return added comment correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });
      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentUserId = await UsersTableTestHelper.addUser({
        id: 'user-111',
        username: 'commenter',
      });

      const newComment = {
        threadId,
        content: 'thread comment',
        owner: commentUserId,
      };

      const mockIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        mockIdGenerator
      );
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: `comment-${mockIdGenerator()}`,
          content: 'thread comment',
          owner: commentUserId,
        })
      );
    });
  });
});
