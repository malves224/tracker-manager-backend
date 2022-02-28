const menuWithPages = require('../db/AllItemsWithPages.json');
const acessPermission = require('../db/AcessPermission.json');
const pages = require('../db/page.json');

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
}

module.exports = {
  getAllItemsMenuWithPagesFake,
  getAllPagesPermissionsByPerfilFake
}