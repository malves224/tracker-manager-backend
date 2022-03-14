const  UserTable  = require('../db/users.json');

const mockFindOne = ({where}) => {
  const columnToFind = Object.keys(where);
  const responseFake =  UserTable.find((user) => user[columnToFind] ===  where[columnToFind]);
  if (!responseFake) {
    return null;
  };
  return responseFake;
}

const findAllFake = ({where}) => {
  const responseFake = UserTable.filter((user) => user.idPerfil === where.idPerfil);
  if (!responseFake.length){
    return Promise.resolve([null]);
  }
  return Promise.resolve([responseFake]);
}

const createUserFake = (_dataToCreate) => {
  const lastUser = UserTable[UserTable.length -1];
  const idFake = lastUser.idPerfil + 1;
  return Promise.resolve({id: idFake});
}

const User = {
  findOne: async (dataToSearch) => mockFindOne(dataToSearch),
  findAll: (dataToSearch) => findAllFake(dataToSearch),
  create: (dataToCreate) => createUserFake(dataToCreate),
};

module.exports = {
  User,
}