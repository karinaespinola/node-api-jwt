class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequest = (code = 400, message) => {
    return new ApiError(code, message);
  }

  static internal = (code = 500, message) => {
    return new ApiError(code, message);
  }
}

module.exports = ApiError;