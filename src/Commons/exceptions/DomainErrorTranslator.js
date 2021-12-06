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
  'LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'username and password is required'
  ),
  'LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username and password must a string'
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError(
    'refresh token is required'
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token must a string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError(
    'refresh token is required'
  ),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token must a string'),
  'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'accessToken and refreshToken is required'
  ),
  'NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'accessToken and refreshToken must a string'
  ),
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    "can't create a new thread because the required property doesn't exist"
  ),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    "can't create a new thread because the data type doesn't match"
  ),
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    "can't create a new comment because the required property doesn't exist"
  ),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    "can't create a new comment because the data type doesn't match"
  ),
  'NEW_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    "can't create a new replies because the required property doesn't exist"
  ),
  'NEW_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    "can't create a new replies because the data type doesn't match"
  ),
};

module.exports = { DomainErrorTranslator };
