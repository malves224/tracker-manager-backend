const menuWithPages = require('../db/AllItemsWithPages.json');
const acessPermission = require('../db/AcessPermission.json');
const pages = require('../db/page.json');
const actions = require('../db/actions.json');
const { QUERY_ACTIONS, QUERY_PAGES } = require('../../../service/Pages');

const getAllItemsMenuWithPagesFake = async () => {
  return Promise.resolve(menuWithPages)
};

const getAllPagesPermissionsByPerfilFake = async ({where}) => {
  let pagesAllowed = [];
  acessPermission.forEach((permission) => {
   if (permission["id_perfil"] === where.idPerfil){
    const itemForAdd = {
      ...permission,
      idPerfil: permission["id_perfil"],
      idpage: permission["id_page"],
      page: pages.find((page) => page.id === permission["id_page"] )
    }
    pagesAllowed =[...pagesAllowed, itemForAdd ] 
   }
  });
  return Promise.resolve(pagesAllowed);
};

const getPagesAllowedByPerfilFake = async (idPerfil) => {
  let pagesAllowed = [];
  const permissionFromIdPerfil = acessPermission
    .filter((perm) => perm["id_perfil"] === idPerfil);
    permissionFromIdPerfil.forEach((permission) => {
    const {id, name, route} = pages.find((page) => page.id === permission["id_page"]);
    pagesAllowed = [...pagesAllowed, {id, name, route}];
  });
  return Promise.resolve(pagesAllowed);
}

const searchQueryPages = async (options) => {
  const { replacements } = options;
  let pagesAllowed = [];
  const permissionFromIdPerfil = acessPermission
    .filter((perm) => perm["id_perfil"] === replacements.idPerfil);
    permissionFromIdPerfil.forEach((permission) => {
    const {id, name, route} = pages.find((page) => page.id === permission["id_page"]);
    pagesAllowed = [...pagesAllowed, {id, name, route}];
  });
  return Promise.resolve(pagesAllowed);
}

const searchQueryActions = async (options) => {
  const { replacements } = options;
  let outputActionsWithPage = [];
  const actionsFiltredByEntity = actions.filter((action) => action.entity === replacements.entity);
  actionsFiltredByEntity
    .forEach(({id, idPage, entity, get, create, delete: deleteAction, edit}) => {
    const {route} = pages.find((page) => page.id === idPage);
    const rowForAdd = {
      idAction: id,
      idPage,
      route,
      entity,
      get,
      create,
      delete: deleteAction,
      edit,
    }
    outputActionsWithPage = [...outputActionsWithPage, rowForAdd]
  });
  return Promise.resolve(outputActionsWithPage);
}

const sequelizeQueryFake = async (query, options) => {
  if (query === QUERY_ACTIONS) {
    const actions = await searchQueryActions(options);
    return actions;
  } else if (query === QUERY_PAGES) {
    const pages = await searchQueryPages(options);
    return pages;
  }
}

const getAllPageWithActionsFake = async () => {
  let pagesWithActions = [];
  pages.forEach(({id, name, route}) => {
    const pageForAdd = {
      id,
      name,
      route,
      actions: actions.filter((action) => action.idPage === id)
    }
    pagesWithActions = [...pagesWithActions, pageForAdd] 
  });
  return Promise.resolve(pagesWithActions);
}

module.exports = {
  getAllItemsMenuWithPagesFake,
  getAllPagesPermissionsByPerfilFake,
  getPagesAllowedByPerfilFake,
  sequelizeQueryFake,
  getAllPageWithActionsFake
}