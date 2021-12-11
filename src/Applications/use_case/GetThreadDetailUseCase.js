/* eslint-disable no-restricted-syntax */

const { RepliesDetail } = require('../../Domains/replies/entities/RepliesDetail');

/* eslint-disable no-await-in-loop */
class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const commentsIds = comments.map((comment) => comment.id);
    const replies = await this._repliesRepository.getRepliesByCommentIds(
      commentsIds
    );

    const commentsWithReplies = [];

    for (const comment of comments) {
      const commentReplies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => new RepliesDetail({ ...reply }))
        .sort((a, b) => a.date - b.date);

      commentsWithReplies.push({
        ...comment,
        replies: commentReplies,
      });
    }
    console.log(commentsWithReplies[0].replies);

    return { ...thread, comments: commentsWithReplies };
  }
}

module.exports = { GetThreadDetailUseCase };
