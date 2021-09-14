const User = require("../model/user");
const jwt = require("jsonwebtoken");
const config = require("../config");
const nodemailer = require("nodemailer");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.email,
    pass: config.passEmail,
  },
});

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function validatePass(pass) {
  const re = /(?=.[a-zA-Z0-9])(?=.{8,})/;
  return re.test(pass);
}
function validateName(name) {
  const re = /(?=.[a-zA-Z0-9])(?=.{1,120})/;
  return re.test(name);
}
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email))
    return res.status(400).json({ message: "email incorrect" });
  if (!validatePass(password))
    return res.status(400).json({ message: "password incorrect" });

  const userFind = await User.findOne({ email });
  if (!userFind)
    return res
      .status(400)
      .json({ message: "user not found or password invalid" });
  const matchPass = await User.comparePass(password, userFind.password);
  if (!matchPass)
    return res
      .status(400)
      .json({ message: "user not found or password invalid" });

  const token = jwt.sign(
    { id: userFind._id, name: userFind.name },
    config.secret,
    { expiresIn: 86400 }
  );
  res.json({ token });
};

exports.register = async (req, res) => {
  const { name, email, password, age } = req.body;
  if (!validateName(name))
    return res.status(400).json({ message: "name incorrect" });
  if (!validateEmail(email))
    return res.status(400).json({ message: "email incorrect" });
  if (!validatePass(password))
    return res.status(400).json({ message: "password incorrect" });

  const userFind = await User.findOne({ email });

  if (userFind) return res.status(400).json({ message: "email invalid" });
  const passwordEncry = await User.encryting(password);

  const newUser = new User({
    name,
    email,
    password: passwordEncry,
  });

  const saveUser = await newUser.save();
  const token = jwt.sign(
    { id: saveUser._id, name: saveUser.name },
    config.secret,
    { expiresIn: 86400 }
  );

  res.json({ token });
};

exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        action: "reset",
      },
      config.secret,
      { expiresIn: 600 }
    ); //10 min
    transport.sendMail(
      {
        from: '"appNotas"<appNotas@appNotas.com>',
        to: user.email,
        subject: "Recupera tu password",
        html: `<h1>Recupera tu password</h1><a href="https://yamilestebangarcia.github.io/Notas/password/index.html?token=${token}">Recupera tu password</a><br/><p>expira en 30 minutos</p>`,
      },
      (err, inf) => {
        if (err) {
          return res.json({ message: "error enviar email" });
        }
      }
    );
  }

  res.json({ message: "ok" });
};
exports.password = async (req, res) => {
  const { token, password } = req.body;
  if (!token) {
    return res.json({ message: "error token invalidate" });
  }
  try {
    const decodeToken = jwt.verify(token, config.secret);
    if (decodeToken.action === "reset" && decodeToken.name && decodeToken.id) {
      if (!validatePass) return res.json({ message: "pass invalidate" });
      const user = await User.findById(decodeToken.id);
      if (user.name !== decodeToken.name) {
        return res.json({ message: "error token invalidate" });
      }
      const passwordEncry = await User.encryting(password);
      const Pass = await User.findByIdAndUpdate(decodeToken.id, {
        password: passwordEncry,
      });
      if (!Pass) {
        return res.json({ message: "error no token" });
      }

      res.json({ message: "changed password" });
    } else {
      return res.json({ message: "error token invalidate" });
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
};
