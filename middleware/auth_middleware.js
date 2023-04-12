const { verifyToken, tokenDecode } = require("../common_lib/jwt_token");

const authMiddleware = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ status: 401, msg: "you are not authorized" });
  }

  token = token?.split(" ")[1];

  try {
    if (verifyToken(token)) {
      let email = tokenDecode(token);
      req.headers.email = email;
      next();
    } else {
      return res.status(401).json({ msg: "you are not authorized" });
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ msg: "something went wrong" });
  }
};

module.exports = { authMiddleware };
