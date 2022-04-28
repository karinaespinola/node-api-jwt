const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcrypt');
const ApiError = require('../middleware/ApiError');

const login = async (req, res, next) => {
  try {
    const user = await User.find({ name: req.body.name }).exec();
    if(user.length === 0) {
     return res.status(404).json({"message": "User not found"});
    }

    if (! await bcrypt.compare(req.body.password, user[0].hashedPassword)) {
     return res.status(401).json({"message": "The password doesn't match!"});
    }

    const accessToken = generateAccessToken ({username: req.body.name})
    const refreshToken = generateRefreshToken ({username: req.body.name})
    res.json({accessToken: accessToken, refreshToken: refreshToken})

  } catch (error) {
    next(ApiError.badRequest(500, "There was an error. This is what we know: " + error));
    return;  
  }
}

const refreshToken = async (req, res, next) => {
  try {
    if(!req.body.token) {
     next(ApiError.badRequest(403, "No token found!"));
    return;    
    }
    // Remove the old refreshToken from the refreshTokens list
    const result = deleteRefreshToken(req.body.token);
    if(!result) {
     next(ApiError.badRequest(403, "The refresh token is not valid!"));
    return;    
    }
    //generate new accessToken and refreshTokens
    const accessToken = generateAccessToken ({user: req.body.name})
    const refreshToken = generateRefreshToken ({user: req.body.name})
    // Save new refresh token to the database
    saveRefreshToken(refreshToken);
    res.json({accessToken: accessToken, refreshToken: refreshToken})
  } catch (error) {
   next(ApiError.badRequest(403, "There was an error while generating the refresh token. This is what we know: " + error));
    return;  
  }
}

const logout = async (req, res, next) => {
  try {
    if(!req.body.token) {
     next(ApiError.badRequest(403, "No token found!"));
    return;    
    }
    // Remove the old refreshToken from the refreshTokens list
    const result = deleteRefreshToken(req.body.token);
    if(!result) {
     next(ApiError.badRequest(403, "The refresh token is not valid!"));
    return;    
    }
   return res.status(204).json({"message": "Logged out!"});
  } catch (error) {
   next(ApiError.badRequest(500, "There was an error while deleting the token from the database. This is what we know: " + error));
    return;  
  }
}

const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"}) 
}

const generateRefreshToken = (userData) => {
  return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"}) 
}

const saveRefreshToken = async (newRefreshToken) => {
  try {
    await RefreshToken.create({
      "token": newRefreshToken
    });
    return true;
  } catch (error) {
    next(ApiError.badRequest(500, "There was an error while saving the refresh token to the database. This is what we know: " + error));
    return;  
  }
}

const deleteRefreshToken = async (tokenToRemove) => {
  try {
    const result = await RefreshToken.deleteOne({ token: tokenToRemove });
    if(result.deletedCount !== 1) {
      return false;
    }
  } catch (error) {
    next(ApiError.badRequest(500, "There was an error while deleting the refresh token from the database. This is what we know: " + error));
    return;  
  }
  return true;
}

module.exports = { login, refreshToken, logout };