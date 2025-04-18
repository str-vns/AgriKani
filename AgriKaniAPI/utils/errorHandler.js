const { STATUSCODE } = require("../constants/index")

class ErrorHandler extends Error {
  constructor(message, statusCode = STATUSCODE.BADREQ) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
      },
    };
  }
}

module.exports = ErrorHandler;
