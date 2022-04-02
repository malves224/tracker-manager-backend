const { expect } = require('chai');
const sinon = require('sinon');
const { login, request } = require('./interfaceRequest');
const fakeUserDB = require('../mock/db/users.json');
const { user: UserModelOrigin, 
  sequelize: sequelizeOrigin,
  acess_profile: AcessProfileOrigin  } = require('../../models');
const { User: UserModelFake } = require('../mock/models/user');
const { sequelizeQueryFake, findOneFake } = require('../mock/models/profile');
const { expectNewUser } = require('../mock/expectData/user');

const userToCreate = {
  "fullName": "MATHEUS ALVES DE OLIVEIRA",
  "occupation": "administrador",
  "email": "teste@clewsat.com",
  "contact": "11954242444",
  "password": "123456789",
  "idPerfil": 1,
}

describe('Rota POST /User', () => {

  before(() => {
    sinon.stub(UserModelOrigin, 'findOne').callsFake(UserModelFake.findOne);
    sinon.stub(sequelizeOrigin, 'query').callsFake(sequelizeQueryFake);
    sinon.stub(AcessProfileOrigin, 'findOne').callsFake(findOneFake);
    sinon.stub(UserModelOrigin, 'create').callsFake(UserModelFake.create);
  });

  after(() => {
    UserModelOrigin.findOne.restore();
    UserModelOrigin.create.restore();
    sequelizeOrigin.query.restore();
    AcessProfileOrigin.findOne.restore();
  });

  describe('Quando o token nao é passado na requisição', () => {
    it('retorna status 401 com a menssagem "Token não encontrado"',async () => {
      const response = await request({ method: "post", rota: "/User" })

        expect(response).to.have.status(401);
        expect(response.body).to.have.property("message", "Token não encontrado");
    });
  });

  describe('Quando é passado um token invalido na requisição', () => {
    it('retorna status 401 com a menssagem "Token invalido ou expirado"',async () => {
      const response = await request({ 
        method: "post", 
        rota: "/User", 
        set: { "Authorization": "token invalido" }
      });

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Token invalido ou expirado");
    });
  });

  describe('Ao passar um body na requisição com o formato incorreto', () => {

    it(`Sem o campo fullName, 
          retorna status 400 com a menssagem '"fullName" is required'`, async () => {
      const { body: { token } } = await login(2);
  
      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        exclude: ["fullName"],
        });
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"fullName" is required');
  
    });

    it(`campo fullName não sendo string,
           retorna status 400 com a menssagem "fullName must be a string"`, async () => {
      const { body: { token } } = await login(2);
      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        update: {"fullName": 123}
        });
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"fullName" must be a string');
    });

    it(`campo fullName com menos de 3 caracteres,
           retorna status 400 com a menssagem '"fullName" length must be at least 3 characters long'`, async () => {
      const { body: { token } } = await login(2);
      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        update: {"fullName": "as"}
        });
        
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"fullName" length must be at least 3 characters long');
    });

    it(`Sem o campo occupation,
           retorna status 400 com a menssagem '"occupation" is required'`, async () => {
      const { body: { token } } = await login(2);
      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        exclude: ["occupation"]
      });
        
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"occupation" is required');
    });

    it(`campo occupation não sendo string,
           retorna status 400 com a menssagem '"occupation" must be a string`, async () => {
      const { body: { token } } = await login(2);
      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        update: { "occupation": 123 }
      });

      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"occupation" must be a string');
    });
    
    it(`campo occupation com menos de 3 caracteres,
           retorna status 400 com a menssagem '"occupation" length must be at least 3 characters long'`, async () => {
      const { body: { token } } = await login(2);
      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        update: { "occupation": "as" }
      });

            
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"occupation" length must be at least 3 characters long');
    });

    it(`Sem o campo email,
           retorna status 400 com a menssagem '"email" is required'`, async () => {
      const { body: { token } } = await login(2);
  
      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        exclude: ["email"]
      });
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"email" is required');
    });

    it(`campo email não sendo string,
           retorna status 400 com a menssagem '"email" must be a string'`, async () => {
      const { body: { token } } = await login(2);

      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        update: {"email": 123}
      });
          
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"email" must be a string');
    });

    it(`campo email com formato invalido,
           retorna status 400 com a menssagem 'Email com formato invalido'`, async () => {
      const { body: { token } } = await login(2);

      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        update: {"email": "teste"}
      });
      
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", 'Email com formato invalido.');

      const response2 = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        update: {"email": "malves224@gmail"}
      });
  
      expect(response2).to.have.status(400);
      expect(response2.body).to.have.property("message", "Email com formato invalido.");

    });

    it(`Sem o campo contact,
           retorna status 400 com a menssagem '"contact" is required'`, async () => {
      const { body: { token } } = await login(2);

      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        exclude: ["contact"]
      });
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"contact" is required');
    });

    it(`campo contact não sendo string,
           retorna status 400 com a menssagem '"contact" must be a string'`, async () => {
      const { body: { token } } = await login(2);
  
      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        update: {"contact": 123}
      });
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"contact" must be a string');
    });

    it(`Campo contact invalido,
      retorna status 400 com a menssagem 'Telefone celular com formato invalido.'`, async () => {
      const { body: { token } } = await login(2);

      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        update: {"contact": "95621459"}
      });
      
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", 'Telefone celular com formato invalido.');
    });

    it(`Sem o Campo password,
           retorna status 400 com a menssagem '"password" is required'`, async () => {
      const { body: { token } } = await login(2);

      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        exclude: ["password"]
      });

      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"password" is required');
    });

    it(`campo password não sendo string,
           retorna status 400 com a menssagem '"password" must be a string'`, async () => {
      const { body: { token } } = await login(2);

      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        update: { "password": 123 }
      });
        
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"password" must be a string');
    });

    it(`Campo password tendo menor que 8 caracteres,
           retorna status 400 com a menssagem '"password" length must be at least 8 characters long'`, async () => {
      const { body: { token } } = await login(2);

      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        update: { "password": "123" }
      });
        
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"password" length must be at least 8 characters long');
    });

    it(`Sem o Campo idPerfil,
           retorna status 400 com a menssagem '"idPerfil" is required'`, async () => {
      const { body: { token } } = await login(2);

      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        exclude: ["idPerfil"]
      });
        
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"idPerfil" is required');
    });

    it(`Campo idPerfil não sendo um numero,
           retorna status 400 com a menssagem '"idPerfil" must be a number'`, async () => {
      const { body: { token } } = await login(2);

      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        update: {"idPerfil": "asd"}
      });
        
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", '"idPerfil" must be a number');
    });

    it(`Campo idPerfil que não existe,
           retorna status 400 com a menssagem "O perfil atribuido não existe."`, async () => {
      const { body: { token } } = await login(2);

      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
        update: {"idPerfil": 999}
      });
        
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "O perfil atribuido não existe.");
    });

  });

  describe('Ao tentar cria usuário, sem a permissão', () => {
    it('Retorna status 401, com a menssagem "Usuario não autorizado."', async () => {
      const { body: { token } } = await login(2);

      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
      });

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Usuario não autorizado.");
    });
  });

  describe('Ao criar usuário', () => {
    it('Retorna status 201, com os dados do usuario criado sem o password', async () => {
      const { body: { token } } = await login(1);

      const response = await request({
        bodyData: userToCreate,
        set: { "Authorization": token },
        method: "post",
        rota: "/User",
      });

      expect(response).to.have.status(201);
      expect(response.body).to.deep.equal(expectNewUser);
    });
  });
});