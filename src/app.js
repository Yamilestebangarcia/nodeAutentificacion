const express = require("express");
const cors = require("cors");
const app = express();
const routePrivate = require("./routes/routesPrivate");
const routeAutentificacion = require("./routes/autentificacion");
app.use(cors());
app.use(express.json());
app.use(routePrivate);
app.use(routeAutentificacion);

module.exports = app;
