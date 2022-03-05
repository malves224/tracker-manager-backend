const { QueryTypes } = require('@sequelize/core');
const { Op } = require('sequelize');
const { sequelize, acess_profile: 
    AcessProfile, acess_permission: 
    AcessPermissions } = require('../models');
const { verifyPermissionAction, verifyPermissionAcess } = require('./util');

const QUERY_ACTIONS_PERFIL = `SELECT ap.id_page, ac.entity, ap.create, ap.delete, ap.edit 
FROM tracker_manager.acess_permissions AS ap
INNER JOIN tracker_manager.actions AS ac ON ap.id_page = ac.id_page
WHERE ap.id_perfil = :idPerfil AND ac.entity = :entity;`;
const MSG_USER_NO_AUTH = 'Usuario não autorizado.';

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

const verifyIfPerfilExist = async (id) => {
  const perfil = await AcessProfile.findOne({ where: { id } });
  return [!!perfil, perfil || 'Perfil de acesso não existe.'];
};

const createManyPermission = (idPerfil, pages) => pages
  .map(({ idPage, edit, delete: deleteAction, create }) => AcessPermissions
    .create({ id_perfil: idPerfil, id_page: idPage, edit, delete: deleteAction, create }));

const editManyPermission = (idPerfil, pages) => pages
  .map(({ idPage, edit, create, delete: del }) => AcessPermissions
    .update(
      { edit, create, delete: del }, 
      { where: { [Op.and]: [{ id_perfil: idPerfil }, { id_page: idPage }] } },
));

const deleteManyPermission = (idPerfil, pages) => pages.map((perm) => AcessPermissions.destroy({
  where: { [Op.and]: [{ id_perfil: idPerfil }, { id_page: perm.idPage }] },
 }));

const updateAcessPermission = async (idPerfil, newPages) => {
  const currentPages = await AcessPermissions.findAll({ where: { id_perfil: idPerfil } });
  const PermissionPagesForDelete = currentPages.filter((currentPage) => !newPages
  .some((newPage) => newPage.idPage === currentPage.idPage));

  const PermissionPagesForCreate = newPages.filter((newPage) => !currentPages
  .some((currentPage) => newPage.idPage === currentPage.idPage));

  const PermissionPagesForUpdate = newPages.filter((newPage) => currentPages
  .some((currentPage) => newPage.idPage === currentPage.idPage));

    if (PermissionPagesForDelete.length) {
       await Promise.all(deleteManyPermission(idPerfil, PermissionPagesForDelete));
    } 
    
    if (PermissionPagesForCreate.length) {
      await Promise.all(createManyPermission(idPerfil, PermissionPagesForCreate));
    }

    const listPromises = editManyPermission(idPerfil, PermissionPagesForUpdate);
    await Promise.all(listPromises);
};

const create = async (idPerfilUser, newProfile) => {
  const [entity, action] = ['acess_profiles', 'create']; // não ha nescidade de verificar de verificar a tabela acess_permission, ja que se trata de uma tabela N:N
  const canCreate = await verifyPermissionAction(idPerfilUser, { entity, action });
  if (!canCreate) {
    return { message: MSG_USER_NO_AUTH };
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
    return { message: MSG_USER_NO_AUTH };
  }
  const allProfiles = await AcessProfile.findAll();
  return allProfiles;
};

const edit = async (idPerfilUser, idPerfilToEdit, perfilDataToUpdate) => {
  const [entity, action] = ['acess_profiles', 'edit'];

  const [perfilExist, content] = await verifyIfPerfilExist(idPerfilToEdit);
  if (!perfilExist) {
    return { code: 400, message: content };
  }
  const perfilHasPermission = await verifyPermissionAction(idPerfilUser, { entity, action });
   if (!perfilHasPermission) {
   return { code: 401, message: 'Usuario não autorizado.' };
  }

  const { name } = perfilDataToUpdate;
  await AcessProfile.update({ name }, { where: { id: idPerfilToEdit } });
  await updateAcessPermission(idPerfilToEdit, perfilDataToUpdate.pages);

  return { id: idPerfilToEdit, ...perfilDataToUpdate };
};

module.exports = { 
  create,
  getActionPermissionByPerfil,
  getAll,
  edit,
  QUERY_ACTIONS_PERFIL,
};