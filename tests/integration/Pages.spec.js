const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const server = require('../../index');
const fakeUserDB = require('../mock/db/users.json');
const { user: UserModelOrigin, sequelize: sequelizeOrigin, page: pageOrigin } = require('../../models');
const { User: UserModelFake } = require('../mock/models/user');
const { sequelizeQueryFake, getAllPageWithActionsFake } = require('../mock/service/pages');

chai.use(chaiHttp);

const expectOutput = [
    {
        "id": 1,
        "name": "Pagina inicial",
        "route": "Home",
        "actions": []
    },
    {
        "id": 2,
        "name": "Novo cliente",
        "route": "NewClient",
        "actions": [
            {
                "id": 1,
                "idPage": 2,
                "entity": "client",
                "get": false,
                "create": true,
                "delete": false,
                "edit": false
            }
        ]
    },
    {
        "id": 3,
        "name": "Clientes",
        "route": "ListClients",
        "actions": [
            {
                "id": 2,
                "idPage": 3,
                "entity": "client",
                "get": true,
                "create": false,
                "delete": false,
                "edit": false
            }
        ]
    },
    {
        "id": 4,
        "name": "Novo veiculo",
        "route": "NewVehicle",
        "actions": [
            {
                "id": 3,
                "idPage": 4,
                "entity": "vehicle",
                "get": false,
                "create": true,
                "delete": false,
                "edit": false
            }
        ]
    },
    {
        "id": 5,
        "name": "Listar veiculos",
        "route": "ListVehicles",
        "actions": [
            {
                "id": 4,
                "idPage": 5,
                "entity": "vehicle",
                "get": true,
                "create": false,
                "delete": false,
                "edit": false
            }
        ]
    },
    {
        "id": 6,
        "name": "Novo Agendamento",
        "route": "NewAgendamento",
        "actions": [
            {
                "id": 5,
                "idPage": 6,
                "entity": "scheduling",
                "get": false,
                "create": true,
                "delete": false,
                "edit": false
            }
        ]
    },
    {
        "id": 7,
        "name": "Listar Agendamentos",
        "route": "ListAgendamentos",
        "actions": [
            {
                "id": 6,
                "idPage": 7,
                "entity": "scheduling",
                "get": true,
                "create": false,
                "delete": false,
                "edit": false
            }
        ]
    },
    {
        "id": 8,
        "name": "Usuarios",
        "route": "UsersControl",
        "actions": [
            {
                "id": 7,
                "idPage": 8,
                "entity": "users",
                "get": true,
                "create": false,
                "delete": false,
                "edit": false
            },
            {
                "id": 12,
                "idPage": 8,
                "entity": "acess_profiles",
                "get": true,
                "create": false,
                "delete": false,
                "edit": false
            }
        ]
    },
    {
        "id": 9,
        "name": "Financeiro",
        "route": "Financeiro",
        "actions": [
            {
                "id": 13,
                "idPage": 9,
                "entity": "extract",
                "get": true,
                "create": true,
                "delete": true,
                "edit": true
            }
        ]
    },
    {
        "id": 10,
        "name": "Estoque",
        "route": "Estoque",
        "actions": [
            {
                "id": 14,
                "idPage": 10,
                "entity": "inventory",
                "get": true,
                "create": true,
                "delete": true,
                "edit": true
            }
        ]
    },
    {
        "id": 11,
        "name": "Informações do usuario",
        "route": "UserInfo",
        "actions": [
            {
                "id": 8,
                "idPage": 11,
                "entity": "users",
                "get": true,
                "create": false,
                "delete": true,
                "edit": true
            },
            {
                "id": 9,
                "idPage": 11,
                "entity": "acess_profiles",
                "get": true,
                "create": false,
                "delete": false,
                "edit": false
            }
        ]
    },
    {
        "id": 12,
        "name": "Cadastro de usuario",
        "route": "NewUser",
        "actions": [
            {
                "id": 10,
                "idPage": 12,
                "entity": "users",
                "get": false,
                "create": true,
                "delete": false,
                "edit": false
            },
            {
                "id": 11,
                "idPage": 12,
                "entity": "acess_profiles",
                "get": true,
                "create": false,
                "delete": false,
                "edit": false
            }
        ]
    },
    {
        "id": 13,
        "name": "Criar Perfil",
        "route": "NewPerfil",
        "actions": [
            {
                "id": 15,
                "idPage": 13,
                "entity": "pages",
                "get": true,
                "create": false,
                "delete": false,
                "edit": false
            },
            {
                "id": 16,
                "idPage": 13,
                "entity": "acess_profiles",
                "get": false,
                "create": true,
                "delete": false,
                "edit": false
            }
        ]
    },
    {
        "id": 14,
        "name": "Informações do perfil",
        "route": "ProfileInfo",
        "actions": [
            {
                "id": 17,
                "idPage": 14,
                "entity": "acess_permissions",
                "get": true,
                "create": false,
                "delete": true,
                "edit": true
            }
        ]
    }
]

describe('Rota /Pages', () => {

  before(() => {
    sinon.stub(UserModelOrigin, 'findOne').callsFake(UserModelFake.findOne);
    sinon.stub(sequelizeOrigin, 'query').callsFake(sequelizeQueryFake)
    sinon.stub(pageOrigin, 'findAll').callsFake(getAllPageWithActionsFake)
  });

  after(() => {
    UserModelOrigin.findOne.restore();
    sequelizeOrigin.query.restore();
    pageOrigin.findAll.restore();
  });


  describe('Quando o token nao é passado na requisição', () => {
    it('retorna status 401 com a menssagem "Token não encontrado"',async () => {
      const response = await chai.request(server)
        .get("/Pages")

        expect(response).to.have.status(401);
        expect(response.body).to.have.property("message", "Token não encontrado");
    });
  });

  describe('Quando é passado um token invalido na requisição', () => {
    it('retorna status 401 com a menssagem "Token invalido ou expirado"',async () => {
      const response = await chai.request(server)
      .get("/Pages")
      .set("Authorization", "token invalido")

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Token invalido ou expirado");
    });
  });

  describe('Quando o usuario não tem acesso a pagina UsersControl', () => {
  
    it('Retorna status 401 com a menssagem "Usuario não autorizado."', async () => {
      const { body: { token } } = await chai.request(server)
        .post("/Login")
        .send({
          login: fakeUserDB[1].login,
          password: "987654321"
        });

      const response = await chai.request(server)
        .get("/Pages")
        .set("Authorization", token);

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Usuario não autorizado.");
    });
  });

  describe('Quando o usuario tem acesso a pagina UsersControl', () => {
    it('Retorna status 200, com todas paginas do sistema e suas actions', async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[0].login,
        password: "123456789"
      });

      const response = await chai.request(server)
      .get("/Pages")
      .set("Authorization", token);

      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal(expectOutput);
    });
  });
});