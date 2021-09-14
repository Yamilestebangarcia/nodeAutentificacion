const { Router } = require("express");
const {
  register,
  login,
  resetPassword,
  password,
} = require("../controller/controllerAutentificacion");
const route = Router();
route.post("/login", login);
route.post("/register", register);
route.post("/resetPassword", resetPassword);
route.post("/password", password);
module.exports = route;
