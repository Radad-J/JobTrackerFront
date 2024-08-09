const cookieParser = require("cookie-parser");
const User = require("../models/userModel");
const { handleErrors } = require("../services/errorsHandler");
const { createToken, maxAge } = require("../services/jwtToken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.json(user);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports = { loginUser };
