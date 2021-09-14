const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, require: true },
    password: { type: String, required: true },
    age: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
UserSchema.statics.encryting = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pass, salt);
};
UserSchema.statics.comparePass = async (pass, recivePass) => {
  return await bcrypt.compare(pass, recivePass);
};

module.exports = model("User", UserSchema);
