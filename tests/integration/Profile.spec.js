const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const server = require('../../index');
const fakeUserDB = require('../mock/db/users.json');
const { user: UserModelOrigin } = require('../../models');
const { User: UserModelFake } = require('../mock/models/user');

chai.use(chaiHttp);

describe('Rota Post /Profile', () => {

  describe('Quando o token nao é passado na requisição', () => {
    it('retorna status 401 com a menssagem "Token não encontrado"',async () => {
      const response = await chai.request(server)
        .get("/Profile")

        expect(response).to.have.status(401);
        expect(response.body).to.have.property("message", "Token não encontrado");
    });
  });

  describe('Quando é passado um token invalido na requisição', () => {
    it('retorna status 401 com a menssagem "Token invalido ou expirado"',async () => {
      const response = await chai.request(server)
      .get("/Profile")
      .set("Authorization", "token invalido")

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Token invalido ou expirado");
    });
  });

  describe('Ao passar um body na requisição com o formato incorreto',async () => {
    before(() => {
      sinon.stub(UserModelOrigin, 'findOne').callsFake(UserModelFake.findOne);
    });

    after(() => {
      UserModelOrigin.findOne.restore();
    });

    it(`Sem o campo name, retorna status 400 
          com a menssagem "Name is required"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });

      const response = await chai.request(server)
        .post("/Profile")
        .send({
           "pages": [
            {
              "idPage": 1,
              "edit": true,
              "delete": true,
              "create": true
            }] 
        })
        .set("Authorization", token);

        expect(response).to.have.status(400);
        expect(response.body).to.have.property("message", "Name is required");
    })

    it(`Com campo name não sendo string, retorna status 400 
          com a menssagem "Name must be a string"`, async () => {
    const { body: { token } } = await chai.request(server)
    .post("/Login")
    .send({
      login: fakeUserDB[1].login,
      password: "987654321"
    });

    const response = await chai.request(server)
      .post("/Profile")
      .send({"name": 1234})
      .set("Authorization", token);

      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "Name must be a string");
    });

    it(`Campo name com menos de 3 de caracteres, retorna status 400 
          com a menssagem "Name must be longer than 2 characters"`, async () => {
    const { body: { token } } = await chai.request(server)
    .post("/Login")
    .send({
      login: fakeUserDB[1].login,
      password: "987654321"
    });

    const response = await chai.request(server)
      .post("/Profile")
      .send({"name": "oi"})
      .set("Authorization", token);

      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "Name must be longer than 2 characters");
    });

    it(`Sem o campo pages, retorna status 400 
          com a menssagem "pages is required"`, async () => {
    const { body: { token } } = await chai.request(server)
    .post("/Login")
    .send({
      login: fakeUserDB[1].login,
      password: "987654321"
    });

    const response = await chai.request(server)
      .post("/Profile")
      .send({"name": "admin"})
      .set("Authorization", token);

      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "pages is required");
    });

    it(`Com o campo pages não sendo um array, retorna status 400 
          com a menssagem "pages must be a array"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });

      const response = await chai.request(server)
        .post("/Profile")
        .send({"name": "admin", "pages": "string"})
        .set("Authorization", token);

        expect(response).to.have.status(400);
        expect(response.body).to.have.property("message", "pages must be a array");
    });

    it(`Com o campo idPage em pages não sendo um number, retorna status 400 
          com a menssagem "idPage must be a number"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });

      const response = await chai.request(server)
        .post("/Profile")
        .send({
          "name": "admin", 
          "pages": [{
            "idPage": "1",
            "edit": true,
            "delete": true,
            "create": true
          }]
        })
        .set("Authorization", token);

        expect(response).to.have.status(400);
        expect(response.body).to.have.property("message", "idPage must be a number");
    });

    it(`Com os campos edit, delete, create não sendo boolean, retorna status 400 
          com a menssagem "edit, create, delete must be a boolean"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
        });

      const response = await chai.request(server)
        .post("/Profile")
        .send({
          "name": "admin", 
          "pages": [{
            "idPage": 1,
            "edit": "true",
            "delete": "true",
            "create": "true"
          }]
        })
        .set("Authorization", token);

        expect(response).to.have.status(400);
        expect(response.body).to.have.property("message", "edit, create, delete must be a boolean");
    });
  }); 
})