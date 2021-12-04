const {
  AddRepliesUseCase,
} = require('../../../../Applications/use_case/AddRepliesUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postRepliesHandler = this.postRepliesHandler.bind(this);
  }

  async postRepliesHandler({ params, payload, auth }, h) {
    const { id: credentialId } = auth.credentials;
    const addRepliesUseCase = this._container.getInstance(AddRepliesUseCase.name);
    const addedReply = await addRepliesUseCase.execute({
      ...params,
      ...payload,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: { addedReply },
    });
    response.code(201);
    return response;
  }
}

module.exports = { RepliesHandler };
