const { InvariantError } = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return this._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    "can't create a new user because the required property doesn't exist"
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    "can't create a new user because the data type doesn't match"
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'cannot create a new user because the username character exceeds the limit'
  ),
  'REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHAR': new InvariantError(
    "can't create a new user because the username contains restricted characters"
  ),
};

module.exports = { DomainErrorTranslator };
