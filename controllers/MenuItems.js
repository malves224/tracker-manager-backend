const { MenuItems } = require('../service');

const getMenuItems = async (req, res) => {
  const userInfo = req.userAuthenticated;
  const itemsMenuWithPages = await MenuItems
    .getAllItemMenuWithPagesAllowed(userInfo.idPerfil);
    
  return res.status(200).json(itemsMenuWithPages);
};

const getPagesAllowed = async (req, res) => {
  const userInfo = req.userAuthenticated;
  const pagesAllowed = await MenuItems.getPagesAllowedByPerfil(userInfo.idPerfil);

  return res.status(200).json(pagesAllowed);
};

module.exports = {
  getMenuItems,
  getPagesAllowed,
};