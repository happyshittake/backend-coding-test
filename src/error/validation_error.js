const BaseError = require("./error");

module.exports = class extends BaseError {
  constructor(msg) {
    super(msg);
    this.jsonFormat = {
      error_code: "VALIDATION_ERROR",
      message: msg
    };
  }
};
