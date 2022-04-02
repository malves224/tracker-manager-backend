const { Pages } = require('../service');

const getPagesAllowed = async (req, res) => {
  const userInfo = req.userAuthenticated;
  const pagesAllowed = await Pages.getPagesAllowedByPerfil(userInfo.idPerfil);

  return res.status(200).json(pagesAllowed);
};

const getAllPages = async (req, res) => {
  const userInfo = req.userAuthenticated;
  const response = await Pages.getAllPages(userInfo.idPerfil);
  if (response.message) {
    return res.status(401).json({ message: response.message });
  }
  return res.status(200).json(response);
};

module.exports = {
  getPagesAllowed,
  getAllPages,
};
