const BaseError = require("./error");

module.exports = class extends BaseError {
  constructor(err) {
    super(err);
    this.jsonFormat = {
      error_code: "SERVER_ERROR",
      message: "Unknown error"
    };
  }
};
