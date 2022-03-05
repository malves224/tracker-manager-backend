const { QueryTypes } = require('@sequelize/core');
const { sequelize, acess_profile: 
    AcessProfile, acess_permission: 
    AcessPermissions } = require('../models');
const { verifyPermissionAction, verifyPermissionAcess } = require('./util');

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

const createManyPermission = (idPerfil, pages) => pages
  .map(({ idPage, edit, delete: deleteAction, create }) => AcessPermissions
    .create({ id_perfil: idPerfil, id_page: idPage, edit, delete: deleteAction, create }));

const create = async (idPerfilUser, newProfile) => {
  const [entity, action] = ['acess_profiles', 'create']; // não ha nescidade de verificar de verificar a tabela acess_permission, ja que se trata de uma tabela N:N
  const canCreate = await verifyPermissionAction(idPerfilUser, { entity, action });
  if (!canCreate) {
    return { message: 'Usuario não autorizado.' };
  }
  
  const { id: idPerfilCreated } = await AcessProfile.create({ name: newProfile.name });
  
  const listPromiseCreatePermission = createManyPermission(idPerfilCreated, newProfile.pages);
  await Promise.all(listPromiseCreatePermission);

  const profileToReturn = { id: idPerfilCreated, ...newProfile };
  return profileToReturn;
};

const getAll = async (idPerfil) => {
  const ENTITY = 'acess_profiles';
  const perfilHasAcess = await verifyPermissionAcess(idPerfil, ENTITY);

  if (!perfilHasAcess) {
    return { message: 'Usuario não autorizado.' };
  }
  const allProfiles = await AcessProfile.findAll();
  return allProfiles;
};

module.exports = { 
  create,
  getActionPermissionByPerfil,
  getAll,
  QUERY_ACTIONS_PERFIL,
};