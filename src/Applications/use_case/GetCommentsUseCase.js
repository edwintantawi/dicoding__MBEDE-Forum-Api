/* eslint-disable no-await-in-loop */
class GetCommentsUseCase {
  constructor({ commentRepository, repliesRepository }) {
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const commentsWithReplies = [];

    for (let i = 0; i < comments.length; i += 1) {
      const replies = await this._repliesRepository.getRepliesByCommentId(
        comments[i].id
      );
      commentsWithReplies.push({
        ...comments[i],
        replies,
      });
    }

    return commentsWithReplies;
  }
}

module.exports = { GetCommentsUseCase };
