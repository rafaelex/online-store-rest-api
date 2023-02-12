const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const [, token] = req.headers.authorization.split(" ");
    console.log(token);
    const decode = jwt.verify(token, process.env.JWT_KEY);
    console.log(decode);
    req.userData = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Authentication failed",
    });
  }
};
