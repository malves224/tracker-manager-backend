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
  const response = await Profiles.create(req.body);
  if (response.message) {
    res.status(200).json({ message: response.message });
  }
  res.status(201).json(response);
};

module.exports = {
  create: [validateProfile, create],
};