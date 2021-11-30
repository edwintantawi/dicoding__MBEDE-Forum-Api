const TABLE_NAME = 'comments';

exports.up = (pgm) => {
  pgm.createTable(TABLE_NAME, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.createConstraint(
    TABLE_NAME,
    'fk_comments.thread_id_threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE'
  );

  pgm.createConstraint(
    TABLE_NAME,
    'fk_comments.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(TABLE_NAME, 'fk_comments.thread_id_threads.id');
  pgm.dropConstraint(TABLE_NAME, 'fk_comments.owner_users.id');
  pgm.dropTable(TABLE_NAME);
};
