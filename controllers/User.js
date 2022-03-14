const { userValidate } = require('../schemas/User');
const { User } = require('../service');

const login = async (req, res) => {
  const responseLogin = await User.login(req.body);
  if (responseLogin.message) {
    return res.status(responseLogin.code).json({ message: responseLogin.message });
  }
  
  res.status(201).json({ token: responseLogin });
};

const validateDataNewUser = async (req, res, next) => {
  try {
    await userValidate(req.body);
    next();
  } catch ({ message }) {
    res.status(400).json({ message });
  }
};

const create = async (req, res) => {
  const { id: idPerfilToGet } = req.params;
  const { idPerfil: idPerfilUser } = req.userAuthenticated;

  const response = await User.getById(idPerfilUser, +idPerfilToGet);
  if (response.message) {
    return res.status(response.code).json({ message: response.message });
  }
  res.status(201).json(response);
};

module.exports = {
  login,
  create: [validateDataNewUser, create],
};