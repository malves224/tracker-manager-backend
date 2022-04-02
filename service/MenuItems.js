const {
  page, menu_item: MenuItem,
  acess_permission: AcessPermission,
} = require('../models');

const { MenuItems: MenuItemsSchema } = require('../schemas');

const getAllItemsMenuWithPages = async () => MenuItem.findAll({
  include: [{ model: page, as: 'pages', attributes: { exclude: 'idPage' } }],
});

const getAllPagesPermissionsByPerfil = async (idPerfil) => AcessPermission.findAll({
  where: { idPerfil },
  include: {
    model: page,
    as: 'page',
    attributes: { exclude: ['idPage', 'createdAt', 'updatedAt'] },
  },
});

const getAllItemMenuWithPagesAllowed = async (idPerfil) => {
  try {
    const allItemsMenuWithPages = await getAllItemsMenuWithPages();
    const allPermissionsPageByPerfil = await getAllPagesPermissionsByPerfil(idPerfil);
    const itemsMenuWithPageAllowed = MenuItemsSchema
      .getItemsNavAllowed(allPermissionsPageByPerfil, allItemsMenuWithPages);
    return itemsMenuWithPageAllowed;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getAllItemMenuWithPagesAllowed,
  getAllItemsMenuWithPages,
  getAllPagesPermissionsByPerfil,
};
