const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const server = require('../../index');
const fakeUserDB = require('../mock/db/users.json');
const fakeProfileDB = require('../mock/db/profiles.json');
const profilesDb = require('../mock/db/profiles.json')
const { user: UserModelOrigin, 
  sequelize: sequelizeOrigin, 
  acess_profile: AcessProfileOrigin,
  acess_permission: AcessPermissionsOrigin } = require('../../models');
const { User: UserModelFake } = require('../mock/models/user');
const { sequelizeQueryFake, createProfileFake, getAllFake, 
  findOneFake, updateFake, updatePermissionFake, 
  findAllPermissionFake } = require('../mock/models/profile');
const { perfilOneWithPages, perfilTwoWithPages } = require('../mock/expectData/Profile');
const { sequelizeQueryFake: sequelizeQueryFakeService } = require('../mock/service/pages')

chai.use(chaiHttp);

describe('Rota POST /Profile', () => {

  before(() => {
    sinon.stub(UserModelOrigin, 'findOne').callsFake(UserModelFake.findOne);
    sinon.stub(sequelizeOrigin, 'query').callsFake(sequelizeQueryFake);
    sinon.stub(AcessProfileOrigin, 'create').callsFake(createProfileFake);
    sinon.stub(AcessPermissionsOrigin, 'create').returns(Promise);
  });

  after(() => {
    UserModelOrigin.findOne.restore();
    sequelizeOrigin.query.restore();
    AcessProfileOrigin.create.restore();
    AcessPermissionsOrigin.create.restore();
  });


  describe('Quando o token nao é passado na requisição', () => {
    it('retorna status 401 com a menssagem "Token não encontrado"',async () => {
      const response = await chai.request(server)
        .post("/Profile")

        expect(response).to.have.status(401);
        expect(response.body).to.have.property("message", "Token não encontrado");
    });
  });

  describe('Quando é passado um token invalido na requisição', () => {
    it('retorna status 401 com a menssagem "Token invalido ou expirado"',async () => {
      const response = await chai.request(server)
      .post("/Profile")
      .set("Authorization", "token invalido")

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Token invalido ou expirado");
    });
  });

  describe('Ao passar um body na requisição com o formato incorreto',async () => {

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

  describe('Ao tentar cria perfil sem permissão', () => {
    it('Retorna status 401, com a menssagem "Usuario não autorizado."', async () => {
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
            "edit": true,
            "delete": true,
            "create": true
          }]
        })
        .set("Authorization", token);

         expect(response).to.have.status(401);
         expect(response.body).to.have.property("message", "Usuario não autorizado.");
    });
  });

  describe('Ao tentar cria perfil com permissão', () => {
    it('Retorna status 201, com o perfil criado no corpo da response', async () => {
      const perfilForCreate = {
        "name": "admin", 
        "pages": [
          {
          "idPage": 1,
          },
          {
            "idPage": 2,
            "create": true,
          },
          {
            "idPage": 11,
            "delete": true,
            "edit": true,
          },
          {
            "idPage": 12,
            "create": true,
          }
        ]
        }

      const expectOutOut = {
        id: fakeProfileDB[fakeProfileDB.length -1].id + 1,
        ...perfilForCreate
      }
      
      const { body: { token } } = await chai.request(server)
        .post("/Login")
        .send({
        login: fakeUserDB[0].login,
        password: "123456789"
        });
      
      const response = await chai.request(server)
        .post("/Profile")
        .send(perfilForCreate)
        .set("Authorization", token);

      expect(response).to.have.status(201);        
      expect(response.body).to.be.deep.equals(expectOutOut);
    });
  });
});

describe('Rota PUT /Profile/:id', () => {
  const bodyValid = {
    "name": "admin",
    "pages": [
      {
        "idPage": 1,
        "edit": true,
        "delete": true,
        "create": true
      }] 
  };

  before(() => {
    sinon.stub(UserModelOrigin, 'findOne').callsFake(UserModelFake.findOne);
    sinon.stub(sequelizeOrigin, 'query').callsFake(sequelizeQueryFake);
    sinon.stub(AcessProfileOrigin, 'findOne').callsFake(findOneFake);
    sinon.stub(AcessProfileOrigin, 'update').callsFake(updateFake);
    sinon.stub(AcessPermissionsOrigin, 'findAll').callsFake(findAllPermissionFake);
  });

  after(() => {
    UserModelOrigin.findOne.restore();
    sequelizeOrigin.query.restore();
    AcessProfileOrigin.findOne.restore();
    AcessProfileOrigin.update.restore();
    AcessPermissionsOrigin.findAll.restore();
  });

  describe('Quando o token nao é passado na requisição', () => {
    it('retorna status 401 com a menssagem "Token não encontrado"',async () => {
      const response = await chai.request(server)
        .put("/Profile/1")

        expect(response).to.have.status(401);
        expect(response.body).to.have.property("message", "Token não encontrado");
    });
  });

  describe('Quando é passado um token invalido na requisição', () => {
    it('retorna status 401 com a menssagem "Token invalido ou expirado"',async () => {
      const response = await chai.request(server)
      .put("/Profile/1")
      .set("Authorization", "token invalido")

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Token invalido ou expirado");
    });
  });

  describe('Ao passar um valor na rota que não seja um numero', () => {
    it('Retorna status 400, com a menssagem "ID Na deve ser um numero."', async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });

      const response = await chai.request(server)
      .put("/Profile/dasdsa")
      .send(bodyValid)
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "ID Na deve ser um numero.")  
    });
  });

  describe('Ao passar um body na requisição com o formato incorreto',async () => {

    it(`Sem o campo name, retorna status 400 
          com a menssagem "Name is required"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });

      const response = await chai.request(server)
        .put("/Profile/1")
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
      .put("/Profile/1")
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
      .put("/Profile/1")
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
      .put("/Profile/1")
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
        .put("/Profile/1")
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
        .put("/Profile/1")
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
        .put("/Profile/1")
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

  describe('Quando o Perfil do usuario para editar não existe', () => {
    it('Retorna status 400 com a menssagem "Perfil de acesso não existe."',async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });

      const response = await chai.request(server)
      .put("/Profile/999")
      .send(bodyValid)
      .set("Authorization", token);
      
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "Perfil de acesso não existe.")
    });
  });

  describe('Quando o Perfil do usuario não tem permissão para editar', () => {
    it('retorna o status 401 com a menssagem "Usuario não autorizado."', async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });

      const response = await chai.request(server)
      .put("/Profile/1")
      .send(bodyValid)
      .set("Authorization", token);

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Usuario não autorizado.")
    })
  });

  describe('Quando o perfil do usuario tem permissão para editar', () => {
    it('Ao editar sem adcionar ou remover paginas, retorna 200 com o perfil do body', async () => {
      const dataForEdit = {
        "name": "editando",
        "pages": [
          {
            "idPage": 1,
            "edit": false,
            "delete": false,
            "create": false
          },
          {
            "idPage": 2,
            "edit": false,
            "delete": false,
            "create": false
          },
          {
            "idPage": 3,
            "edit": false,
            "delete": false,
            "create": false
          },
          {
            "idPage": 4,
            "edit": false,
            "delete": false,
            "create": false
          }

        ] 
      }
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[0].login,
        password: "123456789"
      });

      const response = await chai.request(server)
      .put("/Profile/2")
      .send(dataForEdit)
      .set("Authorization", token);
      
      expect(AcessPermissionsOrigin.update).not.throw();
      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal({"id": 2, ...dataForEdit});
    });
  });
});

describe('Rota GET /Profile', () => {

  before(() => {
     sinon.stub(UserModelOrigin, 'findOne').callsFake(UserModelFake.findOne);
     sinon.stub(sequelizeOrigin, 'query').callsFake(sequelizeQueryFakeService);
     sinon.stub(AcessProfileOrigin, 'findAll').callsFake(getAllFake);
  });

  after(() => {
     UserModelOrigin.findOne.restore();
     sequelizeOrigin.query.restore();
     AcessProfileOrigin.findAll.restore();
  });

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

  describe('Ao tentar acessar perfis sem permissão', () => {
    it('Retorna status 401, com a menssagem "Usuario não autorizado."', async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
        });

      const response = await chai.request(server)
        .get("/Profile")
        .set("Authorization", token);

         expect(response).to.have.status(401);
         expect(response.body).to.have.property("message", "Usuario não autorizado.");
    });
  });

  describe('Ao tentar acessar perfis com permissão', () => {
    it('Retorna status 200, com a todos perfis de acesso."', async () => {
      
      before(() => {
        sinon.stub(AcessPermissionsOrigin, 'findAll').callsFake(findAllPermissionFake);
        sinon.stub(AcessPermissionsOrigin, 'update').callsFake(updatePermissionFake);
      });

      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[0].login,
        password: "123456789"
        });

      const response = await chai.request(server)
        .get("/Profile")
        .set("Authorization", token);

         expect(response).to.have.status(200);
         expect(response.body).to.deep.equals(profilesDb);
    });
  });
});

describe('Rota GET /Profile/:id', () => {

  before(() => {
    sinon.stub(UserModelOrigin, 'findOne').callsFake(UserModelFake.findOne);
    sinon.stub(sequelizeOrigin, 'query').callsFake(sequelizeQueryFakeService);
    sinon.stub(AcessProfileOrigin, 'findAll').callsFake(getAllFake);
    sinon.stub(AcessProfileOrigin, 'findOne').callsFake(findOneFake);
    sinon.stub(AcessPermissionsOrigin, 'findAll').callsFake(findAllPermissionFake)
  });

 after(() => {
    UserModelOrigin.findOne.restore();
    sequelizeOrigin.query.restore();
    AcessProfileOrigin.findAll.restore();
    AcessProfileOrigin.findOne.restore();
    AcessPermissionsOrigin.findAll.restore();
 });

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
      .get("/Profile/1")
      .set("Authorization", "token invalido")

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Token invalido ou expirado");
    });
  });

  describe('Ao tentar acessar perfil sem permissão', () => {
    it('Retorna status 401, com a menssagem "Usuario não autorizado."', async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
        });

      const response = await chai.request(server)
        .get("/Profile/1")
        .set("Authorization", token);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property("message", "Usuario não autorizado.");
    });
  });

  describe('Quando o Perfil de acesso não existe', () => {
    it('Retorna status 400 com a menssagem "Perfil de acesso não existe."',async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[0].login,
        password: "123456789"
      });

      const response = await chai.request(server)
      .get("/Profile/999")
      .set("Authorization", token);

      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "Perfil de acesso não existe.")
    });
  });

  describe('Caso esteja tudo certo com as verificações anteriores', () => {
    it('Retorna status 200 e o perfil de acesso com as paginas permitidas.', async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[0].login,
        password: "123456789"
      });

      const responsePerfilOne = await chai.request(server)
      .get("/Profile/1")
      .set("Authorization", token);

      expect(responsePerfilOne).to.have.status(200);
      expect(responsePerfilOne.body).to.deep.equals(perfilOneWithPages);

      const responsePerfilTwo = await chai.request(server)
      .get("/Profile/2")
      .set("Authorization", token);

      expect(responsePerfilTwo).to.have.status(200);
      expect(responsePerfilTwo.body).to.deep.equals(perfilTwoWithPages);
    });
  });
  
});

describe('Rota DELETE /Profile/:id', () => {

    before(() => {
    sinon.stub(UserModelOrigin, 'findOne').callsFake(UserModelFake.findOne);
    sinon.stub(UserModelOrigin, 'findAll').callsFake(UserModelFake.findAll)
    sinon.stub(sequelizeOrigin, 'query').callsFake(sequelizeQueryFake);
    sinon.stub(AcessProfileOrigin, 'findOne').callsFake(findOneFake);
  });

  after(() => {
    UserModelOrigin.findOne.restore();
    UserModelOrigin.findAll.restore();
    sequelizeOrigin.query.restore();
    AcessProfileOrigin.findOne.restore();
    AcessPermissionsOrigin.restore();
  });

  describe('Quando o token nao é passado na requisição', () => {
    it('retorna status 401 com a menssagem "Token não encontrado"',async () => {
      const response = await chai.request(server)
        .delete("/Profile/1")

        expect(response).to.have.status(401);
        expect(response.body).to.have.property("message", "Token não encontrado");
    });
  });

  describe('Quando é passado um token invalido na requisição', () => {
    it('retorna status 401 com a menssagem "Token invalido ou expirado"',async () => {
      const response = await chai.request(server)
      .delete("/Profile/1")
      .set("Authorization", "token invalido")

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Token invalido ou expirado");
    });
  });

  describe('Ao passar um valor na rota que não seja um numero', () => {
    it('Retorna status 400, com a menssagem "ID Na deve ser um numero."', async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });

      const response = await chai.request(server)
      .delete("/Profile/dasdsa")
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "ID Na deve ser um numero.")  
    });
  });

  describe('Quando o Perfil do usuario para excluir não existe', () => {
    it('Retorna status 400 com a menssagem "Perfil de acesso não existe."',async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });

      const response = await chai.request(server)
      .delete("/Profile/999")
      .set("Authorization", token);
      
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "Perfil de acesso não existe.")
    });
  });

  describe('Quando o Perfil do usuario não tem permissão para excluir', () => {
    it('retorna o status 401 com a menssagem "Usuario não autorizado."', async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });

      const response = await chai.request(server)
      .delete("/Profile/1")
      .set("Authorization", token);

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Usuario não autorizado.")
    })
  });

  describe('Quando o Perfil para exclusão pertence a algum usuario', () => {
    it('Retorna status 403, com a menssagem devida.', async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[0].login,
        password: "123456789"
      });

      const response = await chai.request(server)
      .delete("/Profile/1")
      .set("Authorization", token);

      expect(response).to.have.status(403);
      expect(response.body).to.have.property("message", "Perfil possui vincula com algum usuário, e não pode ser excluido.");
    });
  });

  describe('Quando o perfil para exclusão nao pertence a nenhum usuario', () => {
    it('Retorna status 204, sem informações no body.', async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[0].login,
        password: "123456789"
      });

      const response = await chai.request(server)
      .delete("/Profile/3")
      .set("Authorization", token);

      expect(response).to.have.status(204);
    });

  });
});

