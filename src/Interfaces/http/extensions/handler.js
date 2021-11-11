const { ClientError } = require('../../../Commons/exceptions/ClientError');
const {
  DomainErrorTranslator,
} = require('../../../Commons/exceptions/DomainErrorTranslator');

class ExtensionsHandler {
  onPreResponseHandler({ response }, h) {
    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);
      // client error
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      // server error
      const newResponse = h.response({
        status: 'error',
        message: 'server error',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  }
}

module.exports = { ExtensionsHandler };
