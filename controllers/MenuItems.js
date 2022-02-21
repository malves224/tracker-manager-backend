const { MenuItems } = require('../service');

const getMenuItems = async (req, res) => {
  const userInfo = req.userAuthenticated;
  const itemsMenuWithPages = await MenuItems
    .getAllItemMenuWithPages(userInfo.idPerfil);
    if (itemsMenuWithPages.message) {
      return res.status(itemsMenuWithPages.code)
        .json({ message: itemsMenuWithPages.message });
    }
  return res.status(200).json(itemsMenuWithPages);
};

module.exports = {
  getMenuItems,
};