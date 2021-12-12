class LikeCommentUseCase {
  constructor({ commentRepository, likeRepository }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, credentialId } = useCasePayload;

    await this._commentRepository.checkComment(commentId, threadId);
    const likeId = await this._likeRepository.isLiked(commentId, credentialId);

    if (!likeId) {
      await this._likeRepository.like(commentId, credentialId);
    } else {
      await this._likeRepository.unlike(likeId);
    }
  }
}

module.exports = { LikeCommentUseCase };
