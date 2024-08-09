const User = require("../models/userModel");
const { getIdFromToken } = require("../services/jwtToken");

const getProfile = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const id = getIdFromToken(token);
    const user = await User.findById(id);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = { getProfile };
