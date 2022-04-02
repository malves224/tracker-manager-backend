const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const server = require('../../index');
const fakeUserDB = require('../mock/db/users.json');
const { user: UserModelOrigin, 
  menu_item: MenuItemModelOrigin, acess_permission: AcessPermissionOrigin } = require('../../models');
const serviceMenuItemsFake = require('../mock/service/pages');
const serviceMenuItems = require('../../service/MenuItems');

const { User: UserModelFake } = require('../mock/models/user');

const expectItemsMenu = [
  {
      "id": 1,
      "name": "Pagina inicial",
      "pages": [
          {
              "name": "Pagina inicial",
              "route": "Home"
          }
      ]
  },
  {
      "id": 2,
      "name": "Clientes",
      "pages": [
          {
              "name": "Novo cliente",
              "route": "NewClient"
          },
          {
              "name": "Clientes",
              "route": "ListClients"
          }
      ]
  },
  {
      "id": 3,
      "name": "Veiculos",
      "pages": [
          {
              "name": "Novo veiculo",
              "route": "NewVehicle"
          }
      ]
  }
]


chai.use(chaiHttp);

describe('Rota /MenuItems', () => {

  describe('Quando o token nao é passado na requisição', () => {
    it('retorna status 401 com a menssagem "Token não encontrado"',async () => {
      const response = await chai.request(server)
        .get("/MenuItems")

        expect(response).to.have.status(401);
        expect(response.body).to.have.property("message", "Token não encontrado");
    });
  });

  describe('Quando é passado um token invalido na requisição', () => {
    it('retorna status 401 com a menssagem "Token invalido ou expirado"',async () => {
      const response = await chai.request(server)
      .get("/MenuItems")
      .set("Authorization", "token invalido")

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Token invalido ou expirado");

    });
  });

  describe('Quando é passado um token válido', async () => {


    before(() => {
      sinon.stub(UserModelOrigin, 'findOne').callsFake(UserModelFake.findOne);
      sinon.stub(MenuItemModelOrigin, 'findAll').callsFake(serviceMenuItemsFake.getAllItemsMenuWithPagesFake);
      sinon.stub(AcessPermissionOrigin, 'findAll').callsFake(serviceMenuItemsFake.getAllPagesPermissionsByPerfilFake);
    });

    after(() => {
      UserModelOrigin.findOne.restore();
      MenuItemModelOrigin.findAll.restore();
      AcessPermissionOrigin.findAll.restore();
    });


    it('Retorna apenas os items com as paginas, que o usuario tem permissão de acesso',async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });

      const response = await chai.request(server)
        .get("/MenuItems")
        .set("Authorization", token);
      
       expect(response).to.have.status(200);
       expect(response.body).to.be.deep.equals(expectItemsMenu);
    });
  });
});