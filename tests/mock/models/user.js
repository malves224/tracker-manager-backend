const { Users: UserTable } = require('./dbMock');

const mockFindOne = ({where}) => {
  const columnToFind = Object.keys(where);
  const responseFake =  UserTable.find((user) => user[columnToFind] ===  where[columnToFind]);
  if (!responseFake) {
    return null;
  };
  return responseFake;
}

const User = {
  findOne: async (dataToSearch) => mockFindOne(dataToSearch)
};

module.exports = {
  User,
}