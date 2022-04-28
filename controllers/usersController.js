const User = require('../models/User');
const bcrypt = require('bcrypt');
const ApiError = require('../middleware/ApiError');

const create = async (req, res, next) => {
  try {
    const name = req.body.name;
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    await User.create({
      name,
      hashedPassword
    });
    return res.status(201).json({"message": "User added successfully!"});
  } catch (error) {
    next(ApiError.badRequest(500, "There was an error. This is what we know:" + error));
    return;
  }

}

module.exports = { create };