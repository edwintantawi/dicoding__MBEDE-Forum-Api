const {
  AddThreadUseCase,
} = require('../../../../Applications/use_case/AddThreadUseCase');
const {
  GetThreadDetailUseCase,
} = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler({ auth, payload }, h) {
    const { id: credentialId } = auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({
      ...payload,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: { addedThread },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler({ params }) {
    const getThreadDetailUseCase = this._container.getInstance(
      GetThreadDetailUseCase.name
    );

    const thread = await getThreadDetailUseCase.execute(params);

    return {
      status: 'success',
      data: { thread },
    };
  }
}

module.exports = { ThreadsHandler };
