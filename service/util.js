const { QueryTypes } = require('@sequelize/core');
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

const QUERY_ACTIONS_PERFIL = `SELECT ap.id_page, ac.entity, ap.create, ap.delete, ap.edit 
FROM tracker_manager.acess_permissions AS ap
INNER JOIN tracker_manager.actions AS ac ON ap.id_page = ac.id_page
WHERE ap.id_perfil = :idPerfil AND ac.entity = :entity;`;

const getActionPermissionByPerfil = async (idPerfil, entity) => {
  try {
    const actionsByPerfil = await sequelize.query(QUERY_ACTIONS_PERFIL, {
      replacements: { idPerfil, entity },
      type: QueryTypes.SELECT,
    });
    return actionsByPerfil;
  } catch (error) {
    console.log(error.message);
  }
};

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

const verifyPermissionAcess = async (idPerfil, VerificationValue = 'entity') => {
  const actionsByEntity = await getActionsByEntity('pages');
  const pages = await getPagesAllowedByPerfil(idPerfil);
  const perfilHasAcesso = pages.some((pageItem) => actionsByEntity
    .some((pagesControlEntity) => 
    pagesControlEntity[VerificationValue] === pageItem[VerificationValue]));
  return perfilHasAcesso;
};

const verifyPermissionAction = async (idPerfil, actionEntity) => {
  const { entity, action } = actionEntity;
  const actionsByPerfil = await getActionPermissionByPerfil(idPerfil, entity);
  const canAction = actionsByPerfil.some((actionByPerfil) => actionByPerfil[action]);
  console.log('permisao para action', canAction);
  return canAction;
};

module.exports = {
  verifyPermissionAcess,
  verifyPermissionAction,
  getPagesAllowedByPerfil,
  QUERY_ACTIONS,
  QUERY_PAGES,
};