const events = (handler) => [
  {
    type: 'onPreResponse',
    method: handler.onPreResponseHandler,
  },
];

module.exports = { events };
