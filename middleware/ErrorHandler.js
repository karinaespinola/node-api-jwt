const ApiError = require('./ApiError');


const apiErrorHandler = (err, req, res, next) => {
  if(err instanceof ApiError) {
    res.status(err.code).json(err.message);
    return;
  }

  res.status(500).send('Something went wrong!');
}

module.exports = apiErrorHandler;