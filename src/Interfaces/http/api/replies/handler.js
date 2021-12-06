const {
  AddRepliesUseCase,
} = require('../../../../Applications/use_case/AddRepliesUseCase');
const {
  DeleteRepliesUseCase,
} = require('../../../../Applications/use_case/DeleteRepliesUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postRepliesHandler = this.postRepliesHandler.bind(this);
    this.deleteRepliesHandler = this.deleteRepliesHandler.bind(this);
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

  async deleteRepliesHandler({ params, auth }) {
    const { id: credentialId } = auth.credentials;
    const deleteRepliesUseCase = this._container.getInstance(
      DeleteRepliesUseCase.name
    );
    await deleteRepliesUseCase.execute({ ...params, credentialId });

    return {
      status: 'success',
    };
  }
}

module.exports = { RepliesHandler };
