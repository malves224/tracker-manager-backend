const { Pages } = require('../service');

const getPagesAllowed = async (req, res) => {
  const userInfo = req.userAuthenticated;
  const pagesAllowed = await Pages.getPagesAllowedByPerfil(userInfo.idPerfil);

  return res.status(200).json(pagesAllowed);
};

module.exports = {
  getPagesAllowed,
};