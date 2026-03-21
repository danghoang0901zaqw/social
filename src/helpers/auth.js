const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const verifyPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const compareToken = (token, hash) => hashToken(token) === hash;

module.exports = {
  hashPassword,
  verifyPassword,
  hashToken,
  compareToken,
};
