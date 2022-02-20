const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const server = require('../../index');
const {Users: fakeUserDB} = require('../mock/models/dbMock');
const { user: UserModelOrigin } = require('../../models');

const { User: UserModelFake } = require('../mock/models/user');

chai.use(chaiHttp);

describe('Rota /Login', () => {
  let tokenUser

  before(() => {
    sinon.stub(UserModelOrigin, 'findOne').callsFake(UserModelFake.findOne)
  });

  after(() => {
    UserModelOrigin.findOne.restore();
  });

  describe('Quando os campos obrigatório não é passado ', () => {
    it(`Sem o campo "login" - Retorna o status 400, com a mensagem 
      ""Login" é obrigatório"`, async () => {
        const loginResponse = await chai.request(server)
          .post("/Login")
          .send({
            password: "123456789"
          });

        expect(loginResponse).to.have.status(400);
        expect(loginResponse.body).to.have.property("message", '"Login" é obrigatório');
      });

      it(`Sem o campo "password" - Retorna o status 400, com a mensagem 
      '"Senha" é obrigatório"`, async () => {
        const loginResponse = await chai.request(server)
          .post("/Login")
          .send({
            login: "matheus@clewsat.com.br",
          });

        expect(loginResponse).to.have.status(400);
        expect(loginResponse.body).to.have.property("message", '"Senha" é obrigatório');
      });
  });

  describe('Quando o login estiver inválido', () => {
    it(`Caso o usuario não exista, retorna status 401, com a mensagem
        "Usuario não cadastrado."`, async () => {
          const loginResponse = await chai.request(server)
          .post("/Login")
          .send({
            login: "theus@clewsat.com.br",
            password: "123456789"
          });

        expect(loginResponse).to.have.status(401);
        expect(loginResponse.body).to.have.property("message", "Usuario não cadastrado.");
    });

      it(`Caso a senha seja inválida, retorna status 401, com a mensagem
        'Senha inválida.'`, async () => {
          const loginResponse = await chai.request(server)
          .post("/Login")
          .send({
            login: fakeUserDB[0].login,
            password: "54321"
          });

        expect(loginResponse).to.have.status(401);
        expect(loginResponse.body).to.have.property("message", "Senha inválida.");
    });
  });

  describe('Quando é passado um login válido', () => {
    it('Retorna status 200, com o token no body da response', async () => {
      const loginResponse = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[0].login,
        password: "123456789"
      });

    expect(loginResponse).to.have.status(201);
    expect(loginResponse.body).to.have.property("token");
    });
  });
});
