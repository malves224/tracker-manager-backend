const { MenuItems } = require('../service');

const getMenuItems = async (req, res) => {
  const userInfo = req.userAuthenticated;
  const itemsMenuWithPages = await MenuItems
    .getAllItemMenuWithPagesAllowed(userInfo.idPerfil);
    
  return res.status(200).json(itemsMenuWithPages);
};

module.exports = {
  getMenuItems,
};