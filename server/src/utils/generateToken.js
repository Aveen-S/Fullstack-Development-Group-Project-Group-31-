const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "collabboard_jwt_secret_key_2026";
  const expiresIn = process.env.JWT_EXPIRE || "30d";

  return jwt.sign({ id }, secret, {
    expiresIn,
  });
};

module.exports = generateToken;
