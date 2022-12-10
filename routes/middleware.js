const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({
      error: "Authorization required",
    });
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(401).send({
        error: "Invalid token",
      });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;
