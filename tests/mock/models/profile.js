const { QUERY_ACTIONS_PERFIL } = require('../../../service/Profiles');
const acessPermission = require('../db/AcessPermission.json');
const profilesDb = require('../db/profiles.json')
const actions = require('../db/actions.json');

const sequelizeQueryFake = (query, options) => {
  if (query === QUERY_ACTIONS_PERFIL){
    const { idPerfil, entity } = options.replacements;
    let actionsAllowedByEntity = [];

    acessPermission.
    filter((acessPerm) => acessPerm.id_perfil === idPerfil 
      && actions
          .filter((action) => action.idPage === acessPerm.id_page && action.entity === entity).length)
    .forEach((acess) => actionsAllowedByEntity = [...actionsAllowedByEntity, {
        id_page: acess.id_page, entity, 
        create: !acess.create ? null : 1, 
        delete: !acess.delete ? null : 1, 
        edit: !acess.edit ? null : 1
    }]);

    return Promise.resolve(actionsAllowedByEntity);
  }
  return {};
}

const createProfileFake = (newProfile) => {
  let profiles = profilesDb;
  profiles = [...profiles, {
    id:profiles[profiles.length -1].id + 1,
    name: newProfile.name,
  }]
  return Promise.resolve(profiles[profiles.length -1]);
}

const getAllFake = () => {
  return Promise.resolve(profilesDb);
}

const findOneFake = ({where}) => {
  const columnToSearch = Object.keys(where);
  const profile = profilesDb
    .find((profile) => profile[columnToSearch[0]] === where[columnToSearch[0]]);
  return Promise.resolve(profile);
}

module.exports = {
  sequelizeQueryFake,
  createProfileFake,
  getAllFake,
  findOneFake
}