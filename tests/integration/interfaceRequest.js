const fakeUserDB = require('../mock/db/users.json');
const chai = require('chai');
const server = require('../../index');

const login = async (idUser, rota = "/Login") => {
  const { login, passwordNoHash } = fakeUserDB.find((user) => user.id == idUser);
  const response = await chai.request(server)
  .post(rota)
  .send({
    login,
    password: passwordNoHash
  });
  return response;
};

const changeObjNoMutation = (obj, update, listOfExclude = [], ) => {
  const copyObj = {
    ...obj,
    ...update,
  };
  listOfExclude.forEach((excludeKey) => {
    delete copyObj[excludeKey]
  });
  return copyObj;
}

const request = async ({bodyData, set = {}, method, rota, exclude, update}) => {
  const bodyForSend = changeObjNoMutation(bodyData, update, exclude);

  const setHeader = Object.keys(set);
  try {
     if (!setHeader.length) {
      const responseNoHeaders = await chai.request(server)
      [method](rota)
      .send(bodyForSend)
      return responseNoHeaders;
     }
    
    const response = await chai.request(server)
    [method](rota)
    .send(bodyForSend)
    .set(setHeader[0], set[setHeader[0]]);
    return response;
    
  } catch (error) {
   console.log('error:', error.message) 
  }
}

module.exports = {
  login,
  request,
}
