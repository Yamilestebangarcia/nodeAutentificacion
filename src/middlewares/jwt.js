const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../model/user");

exports.verifytoken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ message: "no token provided" });
    const decodeToken = jwt.verify(token, config.secret);
    const user = await User.findById(decodeToken.id);
    if (!user) return res.status(404).json({ message: "no user found" });
    req.dataUser = { name: user.name, email: user.email, id: user.id };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorrize" });
  }
};
