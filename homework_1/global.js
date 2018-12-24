// Constants: status codes & event handlers
const global = {
  HTTP_STATUS_CODES: {
    OK: 200,
    NOT_FOUND: 404
  },
  EVENT_HANDLERS: {
    ON_DATA: 'data',
    ON_END: 'end'
  }
};

module.exports = global;