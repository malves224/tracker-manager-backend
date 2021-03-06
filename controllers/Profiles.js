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

const validateParamsId = (req, res, next) => {
  const id = +req.params.id;
  if (!id) {
    return res.status(400).json({ message: 'ID Na deve ser um numero.' });
  }
  next();
};

const create = async (req, res) => {
  const { idPerfil } = req.userAuthenticated;
  const response = await Profiles.create(idPerfil, req.body);
  if (response.message) {
    res.status(401).json({ message: response.message });
  }
  res.status(201).json(response);
};

const edit = async (req, res) => {
  const { id: idPerfilToEdit } = req.params;
  const { idPerfil: idPerfilUser } = req.userAuthenticated;
  const response = await Profiles.edit(idPerfilUser, +idPerfilToEdit, req.body);
  if (response.message) {
    res.status(response.code).json({ message: response.message });
  }
  res.status(200).json(response);
};

const getAll = async (req, res) => {
  const { idPerfil } = req.userAuthenticated;
  const response = await Profiles.getAll(idPerfil);
  if (response.message) {
    res.status(401).json({ message: response.message });
  }
  res.status(200).json(response);
};

const deleteProfile = async (req, res) => {
  const { id: idPerfilToDelete } = req.params;
  const { idPerfil } = req.userAuthenticated;

  const responseDel = await Profiles.deleteProfile(idPerfil, +idPerfilToDelete);
  if (responseDel.message) {
    return res.status(responseDel.code).json({ message: responseDel.message });
  }
  return res.status(204).end();
};

const getById = async (req, res) => {
  const { id: idPerfilToGet } = req.params;
  const { idPerfil: idPerfilUser } = req.userAuthenticated;

  const response = await Profiles.getById(idPerfilUser, +idPerfilToGet);
  if (response.message) {
    return res.status(response.code).json({ message: response.message });
  }
  res.status(200).json(response);
};

module.exports = {
  create: [validateProfile, create],
  getAll: [getAll],
  edit: [validateParamsId, validateProfile, edit],
  deleteProfile: [validateParamsId, deleteProfile],
  getById: [validateParamsId, getById],
};
