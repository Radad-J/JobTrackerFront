const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const secretKey = process.env.jwt_secret_key;

// Pour 30 jours
const maxAge = 30 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, secretKey, { expiresIn: maxAge });
};

const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

const getIdFromToken = (token) => {
  return verifyToken(token, secretKey)["id"];
};

module.exports = {
  createToken,
  verifyToken,
  getIdFromToken,
  maxAge,
};
