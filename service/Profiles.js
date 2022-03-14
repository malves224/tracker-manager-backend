const { Op } = require('sequelize');
const { acess_profile: 
    AcessProfile, acess_permission: 
    AcessPermissions, user,
   } = require('../models');
const { verifyPermissionAction, verifyPermissionAcess } = require('./util');

const QUERY_ACTIONS_PERFIL = `SELECT ap.id_page, ac.entity, ap.create, ap.delete, ap.edit 
FROM tracker_manager.acess_permissions AS ap
INNER JOIN tracker_manager.actions AS ac ON ap.id_page = ac.id_page
WHERE ap.id_perfil = :idPerfil AND ac.entity = :entity;`;
const MSG_USER_NO_AUTH = 'Usuario não autorizado.';

const verifyIfPerfilExist = async (id, msg = 'Perfil de acesso não existe.') => {
  const perfil = await AcessProfile.findOne({ where: { id } });
  return [!!perfil, perfil || msg];
};

const verifyIfPerfilBelongToAnyUser = async (idPerfil) => {
  const [usersByIdPerfil] = await user.findAll({ where: { idPerfil } });
  return !!usersByIdPerfil;
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
  const currentPages = await AcessPermissions.findAll({ where: { idPerfil } });
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
   return { code: 401, message: MSG_USER_NO_AUTH };
  }

  const { name } = perfilDataToUpdate;
  await AcessProfile.update({ name }, { where: { id: idPerfilToEdit } });
  await updateAcessPermission(idPerfilToEdit, perfilDataToUpdate.pages);

  return { id: idPerfilToEdit, ...perfilDataToUpdate };
};

const deleteProfile = async (idPerfilUser, idPerfilToDelete) => {
  const [entity, action] = ['acess_profiles', 'delete'];

  const [perfilExist, content] = await verifyIfPerfilExist(idPerfilToDelete);
  if (!perfilExist) {
    return { code: 400, message: content };
  }
  const perfilHasPermission = await verifyPermissionAction(idPerfilUser, { entity, action });
  if (!perfilHasPermission) {
    return { code: 401, message: MSG_USER_NO_AUTH };
  }
  const perfilBelongToAnyUser = await verifyIfPerfilBelongToAnyUser(idPerfilToDelete);
  if (perfilBelongToAnyUser) {
    return { code: 403, 
    message: 'Perfil possui vincula com algum usuário, e não pode ser excluido.' };
  }
  await AcessProfile.destroy({ where: { id: idPerfilToDelete } });
  return {};
};

const getPagesByPerfil = async (idPerfil) => {
  const profilePagesWithActions = await AcessPermissions.findAll({ 
    where: { idPerfil }, attributes: { exclude: ['id_page', 'id_perfil', 'idPerfil'] },
  });
  return profilePagesWithActions;
};

const getById = async (idPerfilUser, idPerfilToGet) => {
  const ENTITY = 'acess_profiles';
  const perfilHasAcess = await verifyPermissionAcess(idPerfilUser, ENTITY);

  const [perfilExist, content] = await verifyIfPerfilExist(idPerfilToGet);
  if (!perfilExist) {
    return { code: 400, message: content };
  }

  if (!perfilHasAcess) {
    return { code: 401, message: MSG_USER_NO_AUTH };
  }
  const perfilToGetData = content;
  const profilePagesWithActions = await getPagesByPerfil(idPerfilToGet);
  return {
    id: perfilToGetData.id,
    name: perfilToGetData.name,
    pages: profilePagesWithActions,
  };
};

module.exports = { 
  create,
  getAll,
  edit,
  deleteProfile,
  getById,
  verifyIfPerfilExist,
  QUERY_ACTIONS_PERFIL,
};