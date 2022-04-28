const jwt = require('jsonwebtoken');
const ApiError = require('./ApiError');

const validateToken = (req, res, next) => {
  //get token from request header
  try {
    if(!req.headers['authorization']) {
      next(ApiError.badRequest(403, "No authorization headers found"));
    }
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1]
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    if (token === undefined || authHeader === undefined) {
      next(ApiError.badRequest(400, "Token not present"));
      return;
    } 
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) { 
        next(ApiError.badRequest(403, "Token invalid"));
        return;
      }
      else {
        console.log(user);
        req.user = user
        next() //proceed to the next action in the calling function
     }
    }); //end of jwt.verify()
  } catch (error) {
    next(ApiError.badRequest(500, "There was an error. This is what we know: " + error));
    return;
  }

} //end of function

module.exports = validateToken;