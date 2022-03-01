const { QueryTypes } = require('@sequelize/core');
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

module.exports = {
  getPagesAllowedByPerfil,
};