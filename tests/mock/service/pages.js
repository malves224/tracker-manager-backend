const menuWithPages = require('../db/AllItemsWithPages.json');
const acessPermission = require('../db/AcessPermission.json');
const pages = require('../db/page.json');
const actions = require('../db/actions.json');

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

const sequelizeQueryFake = async (_query, options) => {
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