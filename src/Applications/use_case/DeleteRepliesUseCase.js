class DeleteRepliesUseCase {
  constructor({ commentRepository, repliesRepository }) {
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, credentialId, replyId } = useCasePayload;
    await this._commentRepository.checkComment(commentId, threadId);
    await this._repliesRepository.checkReplies(replyId, commentId);
    await this._repliesRepository.checkRepliesAccess(replyId, credentialId);
    await this._repliesRepository.deleteRepliesById(replyId);
  }
}

module.exports = { DeleteRepliesUseCase };
