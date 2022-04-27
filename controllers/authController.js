const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  try {
    const user = await User.find({ name: req.body.name }).exec();
    if(user.length === 0) {
      res.status(404).send({"message": "User not found"});
    }

    if (! await bcrypt.compare(req.body.password, user[0].hashedPassword)) {
      res.status(401).send({"message": "The password doesn't match!"});
    }

    const accessToken = generateAccessToken ({username: req.body.name})
    const refreshToken = generateRefreshToken ({username: req.body.name})
    res.json({accessToken: accessToken, refreshToken: refreshToken})

  } catch (error) {
    res.status(500).send({"message": "There was an error. This is what we know: " + error})
  }
}

const refreshToken = async (req, res) => {
  if (!refreshTokens.includes(req.body.token)) res.status(400).send("Refresh Token Invalid")
  refreshTokens = refreshTokens.filter( (c) => c != req.body.token)
  //remove the old refreshToken from the refreshTokens list
  const accessToken = generateAccessToken ({user: req.body.name})
  const refreshToken = generateRefreshToken ({user: req.body.name})
  //generate new accessToken and refreshTokens
  res.json ({accessToken: accessToken, refreshToken: refreshToken})
}

const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"}) 
}

const generateRefreshToken = (userData) => {
  return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"}) 
}

module.exports = { login };