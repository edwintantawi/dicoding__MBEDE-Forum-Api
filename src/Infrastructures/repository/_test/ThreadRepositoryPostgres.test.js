const {
  ThreadsTableTestHelper,
} = require('../../../../tests/ThreadsTableTestHelper');
const { UsersTableTestHelper } = require('../../../../tests/UsersTableTestHelper');
const { NotFoundError } = require('../../../Commons/exceptions/NotFoundError');
const { NewThread } = require('../../../Domains/threads/entities/NewThread');
const { pool } = require('../../database/postgres/pool');
const { ThreadRepositoryPostgres } = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread method', () => {
    it('should presist new thread and return added thread correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const newThread = new NewThread({
        title: 'dicoding thread',
        body: 'dicoding thread body',
        owner: ownerId,
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await threadRepositoryPostgres.addThread(newThread);

      const threads = await ThreadsTableTestHelper.findThreadById(`thread-123`);
      expect(threads).toHaveLength(1);
    });
  });

  describe('getThreadById', () => {
    it('should throw notFound error when thread not found', async () => {
      const threadId = 'thread-000';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.getThreadById(threadId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should return correct thread', async () => {
      const userId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const dbThread = await ThreadsTableTestHelper.addThread({ owner: userId });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.getThreadById(dbThread.id);

      expect(thread).toStrictEqual({
        id: dbThread.id,
        title: dbThread.title,
        body: dbThread.body,
        date: dbThread.date,
        username: 'dicoding',
      });
    });
  });
});
