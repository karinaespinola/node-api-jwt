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
    res.status(201).send({"message": "User added successfully!"});
  } catch (error) {
    res.status(500).send({"message": "There was an error. This is what we know:" + error});
  }

}

module.exports = { create };