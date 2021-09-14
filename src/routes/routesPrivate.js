const { Router } = require("express");
const {
  usuario,
  crearnota,
  borrarNota,
  actualizarNota,
} = require("../controller/controllerPrivate");
const { verifytoken } = require("../middlewares/jwt");
const route = Router();
route.get("/usuario", verifytoken, usuario);

route.post("/crearnota", verifytoken, crearnota);

route.put("/actualizarnota/:id", verifytoken, actualizarNota);

route.delete("/borrarnota/:id", verifytoken, borrarNota);
module.exports = route;
