const mongoose = require("mongoose");
const config = require("./config");
mongoose.connect(config.mongourl).catch((err) => {
  console.log("db no conectada", err);
});
