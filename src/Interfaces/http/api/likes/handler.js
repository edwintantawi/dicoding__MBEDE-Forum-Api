const {
  LikeCommentUseCase,
} = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.likeCommentHandler = this.likeCommentHandler.bind(this);
  }

  async likeCommentHandler({ auth, params }) {
    const { id: credentialId } = auth.credentials;
    const { threadId, commentId } = params;

    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);

    await likeCommentUseCase.execute({ threadId, commentId, credentialId });

    return {
      status: 'success',
    };
  }
}

module.exports = { LikesHandler };
