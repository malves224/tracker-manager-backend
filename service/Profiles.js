const { QueryTypes } = require('@sequelize/core');
const { sequelize, acess_profile: 
    AcessProfile, acess_permission: AcessPermissions } = require('../models');

const QUERY_ACTIONS = `SELECT ap.id_page, ac.entity, ap.create, ap.delete, ap.edit 
FROM tracker_manager.acess_permissions AS ap
INNER JOIN tracker_manager.actions AS ac ON ap.id_page = ac.id_page
WHERE ap.id_perfil = :idPerfil AND ac.entity = :entity;`;

const getActionPermissionByPerfil = async (idPerfil, entity) => {
  try {
    const actionsByPerfil = await sequelize.query(QUERY_ACTIONS, {
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
  const actionsByPerfil = await getActionPermissionByPerfil(idPerfilUser, entity);
  const canCreate = actionsByPerfil.some((actionByPerfil) => actionByPerfil[action]);
  if (!canCreate) {
    return { message: 'Usuario não autorizado.' };
  }
  
  const { id: idPerfilCreated } = await AcessProfile.create({ name: newProfile.name });
  
  const listPromiseCreatePermission = createManyPermission(idPerfilCreated, newProfile.pages);
  await Promise.all(listPromiseCreatePermission);

  const profileToReturn = { id: idPerfilCreated, ...newProfile };
  return profileToReturn;
};

module.exports = { 
  create,
  QUERY_ACTIONS,
};