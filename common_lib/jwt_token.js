const jwt = require("jsonwebtoken");
const SECRET_KEY = "MY_secret_key";

// generateToken
const generateToken = (payload) => {
  let token = jwt.sign(JSON.stringify(payload), SECRET_KEY);
  return token;
}

// verifyToken
const verifyToken = (token) => {
  let data = jwt.verify(token, SECRET_KEY);
  return data;
}

// tokenDecode
const tokenDecode = (token) => {
  let data = jwt.decode(token);
  return data;
}

module.exports = {
  generateToken,
  verifyToken,
  tokenDecode,
};
