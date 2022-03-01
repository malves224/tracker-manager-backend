const { QueryTypes } = require('@sequelize/core');
const { 
  page, menu_item: MenuItem, 
  acess_permission: AcessPermission, 
  sequelize, 
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

const getPagesAllowedByPerfil = async (idPerfil) => {
  try {
    const pages = await sequelize
      .query(`SELECT id, name, route FROM tracker_manager.acess_permissions
    INNER JOIN tracker_manager.pages as pg on id_page = pg.id
    WHERE id_perfil = :idPerfil;`, {
      replacements: { idPerfil },
      type: QueryTypes.SELECT,
    });
    return pages;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getAllItemMenuWithPagesAllowed,
  getAllItemsMenuWithPages,
  getAllPagesPermissionsByPerfil,
  getPagesAllowedByPerfil,
};