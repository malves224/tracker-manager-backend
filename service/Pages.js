const { QueryTypes } = require('@sequelize/core');
const { page, action } = require('../models');
const { sequelize } = require('../models');

const QUERY_ACTIONS = 'SELECT `ac`.`id` AS `idAction`, `id_page` AS `idPage`, `route`,'
+ ' `entity`, `get`, `create`, `delete`, `edit`'
+ ' FROM tracker_manager.`actions` AS `ac`'
+ ' INNER JOIN tracker_manager.`pages` AS `pg` ON `pg`.`id` = `id_page`'
+ ' WHERE `entity` = :entity;';

const QUERY_PAGES = `SELECT pg.id, ac.entity, name, route FROM 
tracker_manager.acess_permissions as ap
INNER JOIN tracker_manager.pages as pg on ap.id_page = pg.id
INNER JOIN tracker_manager.actions as ac on pg.id = ac.id_page
WHERE ap.id_perfil = :idPerfil;`;

const getPagesAllowedByPerfil = async (idPerfil) => {
  try {
    const pages = await sequelize
      .query(QUERY_PAGES, {
      replacements: { idPerfil },
      type: QueryTypes.SELECT,
    });
    return pages;
  } catch (error) {
    console.log(error.message);
  }
};

const getActionsByEntity = async (entity) => {
  try {
    const actions = await sequelize.query(QUERY_ACTIONS, {
      replacements: { entity },
      type: QueryTypes.SELECT,
    });
    return actions;
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
  const actionsByEntity = await getActionsByEntity('pages');
  const pages = await getPagesAllowedByPerfil(idPerfil);
  const perfilHasAcesso = pages.some((pageItem) => actionsByEntity
    .some((pagesControlEntity) => pagesControlEntity.route === pageItem.route));
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
  getActionsByEntity,
  QUERY_ACTIONS,
  QUERY_PAGES,
};