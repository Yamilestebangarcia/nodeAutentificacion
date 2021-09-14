const Notas = require("../model/notas");

function validateTitle(title) {
  const re = /(?=.[a-zA-Z0-9])(?=.{1,120})/;
  return re.test(title);
}
function validateDescription(description) {
  const re = /(?=.[a-zA-Z0-9])(?=.{1,1200})/;
  return re.test(description);
}
function validateState(state) {
  const re = /urgente || importante || secundario/;
  return re.test(state);
}
exports.usuario = async (req, res) => {
  const allNotas = await Notas.find({ "user.0": req.dataUser.id });

  res.json({ user: req.dataUser.name, allNotas });
};

exports.crearnota = async (req, res) => {
  const { title, description, state } = req.body;
  if (!validateTitle(title))
    return res.status(400).json({ message: "invalid title" });
  if (!validateDescription(description))
    return res.status(400).json({ message: "invalid description" });
  if (!validateState(state))
    return res.status(400).json({ message: "invalid state" });
  const newNota = new Notas({
    title,
    description,
    state,
    user: req.dataUser.id,
  });
  const saveNota = await newNota.save();
  res.json(saveNota);
};

exports.actualizarNota = async (req, res) => {
  const actualizado = await Notas.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(actualizado);
};

exports.borrarNota = async (req, res) => {
  const borrado = await Notas.findByIdAndDelete(req.params.id);
  res.json(borrado);
};
