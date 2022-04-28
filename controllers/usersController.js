const User = require('../models/User');
const bcrypt = require('bcrypt');

const create = async (req, res) => {
  try {
    const name = req.body.name;
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    await User.create({
      name,
      hashedPassword
    });
    return res.status(201).json({"message": "User added successfully!"});
  } catch (error) {
    return res.status(500).json({"message": "There was an error. This is what we know:" + error});
  }

}

module.exports = { create };