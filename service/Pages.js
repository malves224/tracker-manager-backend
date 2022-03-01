const { QueryTypes } = require('@sequelize/core');
const { page, action } = require('../models');
const { sequelize } = require('../models');

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

const allPageLoading = () => page.findAll({ 
  attributes: ['id', 'name', 'route'],
  include: { 
    model: action, 
    as: 'actions',
    attributes: { exclude: ['id_page'] },
   },
});

const getAllPages = async (idPerfil) => {
  const pages = await getPagesAllowedByPerfil(idPerfil);
  const perfilHasAcesso = pages.some((pageItem) => pageItem.route === 'UsersControl');
  if (!perfilHasAcesso) {
    return { message: 'Usuario não autorizado.' };
  }
  try {
    const allPages = await allPageLoading();
    return allPages;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getPagesAllowedByPerfil,
  getAllPages,
};