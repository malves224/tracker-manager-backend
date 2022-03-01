const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const server = require('../../index');
const fakeUserDB = require('../mock/db/users.json');
const { user: UserModelOrigin } = require('../../models');
const { User: UserModelFake } = require('../mock/models/user');
const { getPagesAllowedByPerfilFake } = require('../mock/service/pages');
const { Pages } = require('../../service');

chai.use(chaiHttp);

const expectOutput = [
  { id: 1, name: 'Pagina inicial', route: 'Home' },
  { id: 2, name: 'Novo cliente', route: 'NewClient' },
  { id: 3, name: 'Clientes', route: 'ListClients' },
  { id: 4, name: 'Novo veiculo', route: 'NewVehicle' },
  { id: 11, name: 'Informações do usuario', route: 'UserInfo' },
  { id: 12, name: 'Cadastro de usuario', route: 'NewUser' }
]

describe('Rota /UserPages', () => {

  describe('Quando o token nao é passado na requisição', () => {
    it('retorna status 401 com a menssagem "Token não encontrado"',async () => {
      const response = await chai.request(server)
        .get("/UserPages")

        expect(response).to.have.status(401);
        expect(response.body).to.have.property("message", "Token não encontrado");
    });
  });

  describe('Quando é passado um token invalido na requisição', () => {
    it('retorna status 401 com a menssagem "Token invalido ou expirado"',async () => {
      const response = await chai.request(server)
      .get("/UserPages")
      .set("Authorization", "token invalido")

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Token invalido ou expirado");
    });
  });

  describe('Quando é passado um token valido', () => {
    before(() => {
      sinon.stub(UserModelOrigin, 'findOne').callsFake(UserModelFake.findOne);
      sinon.stub(Pages, 'getPagesAllowedByPerfil')
        .callsFake(getPagesAllowedByPerfilFake)
    });

    after(() => {
      UserModelOrigin.findOne.restore();
    });

    it('Retorna apenas as paginas que o usuario tem acesso', async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });

      const response = await chai.request(server)
      .get("/UserPages")
      .set("Authorization", token);

      expect(response).to.have.status(200);
      expect(response.body).to.be.deep.equals(expectOutput);
    });

  });
});