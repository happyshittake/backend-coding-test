const BaseError = require("./error");

module.exports = class extends BaseError {
  constructor(msg) {
    super(msg);
    this.jsonFormat = {
      error_code: "RIDES_NOT_FOUND_ERROR",
      message: msg
    };
  }
};
