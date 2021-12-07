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

    return { ...thread, comments: commentsWithReplies };
  }
}

module.exports = { GetThreadDetailUseCase };
