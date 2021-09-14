const { Schema, model } = require("mongoose");

const notasSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    state: { type: String, required: true },
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
module.exports = model("Notas", notasSchema);
