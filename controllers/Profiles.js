const { Profiles } = require('../service');
const { Profiles: validate } = require('../schemas');

const validateProfile = async (req, res, next) => {
  try {
    await validate.profile(req.body);
    next();
  } catch ({ message }) {
    res.status(400).json({ message });
  }
};

const create = async (req, res) => { 
  const { idPerfil } = req.userAuthenticated;
  const response = await Profiles.create(idPerfil, req.body);
  if (response.message) {
    res.status(401).json({ message: response.message });
  }
  res.status(201).json(response);
};

const getAll = async (req, res) => {
   const { idPerfil } = req.userAuthenticated;
   const response = await Profiles.getAll(idPerfil);
   if (response.message) {
    res.status(401).json({ message: response.message });
   }
  res.status(201).json('ok');
};

module.exports = {
  create: [validateProfile, create],
  getAll: [getAll],
};