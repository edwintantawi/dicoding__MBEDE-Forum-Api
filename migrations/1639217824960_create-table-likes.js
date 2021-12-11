const TABLE_NAME = 'likes';

exports.up = (pgm) => {
  pgm.createTable(TABLE_NAME, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.createConstraint(
    TABLE_NAME,
    'fk_likes.comment_id_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE'
  );

  pgm.createConstraint(
    TABLE_NAME,
    'fk_likes.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(TABLE_NAME, 'fk_likes.comment_id_comments.id');
  pgm.dropConstraint(TABLE_NAME, 'fk_likes.user_id_users.id');
  pgm.dropTable(TABLE_NAME);
};
