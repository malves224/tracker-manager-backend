const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const server = require('../../index');
const fakeUserDB = require('../mock/db/users.json');
const { user: UserModelOrigin, sequelize: sequelizeOrigin } = require('../../models');
const { User: UserModelFake } = require('../mock/models/user');
const { sequelizeQueryFake } = require('../mock/models/profile');


describe.only('Rota POST /User', () => {

  before(() => {
    sinon.stub(UserModelOrigin, 'findOne').callsFake(UserModelFake.findOne);
    sinon.stub(sequelizeOrigin, 'query').callsFake(sequelizeQueryFake);
  });

  after(() => {
    UserModelOrigin.findOne.restore();
    sequelizeOrigin.query.restore();
  });

  describe('Quando o token nao é passado na requisição', () => {
    it('retorna status 401 com a menssagem "Token não encontrado"',async () => {
      const response = await chai.request(server)
        .post("/User")

        expect(response).to.have.status(401);
        expect(response.body).to.have.property("message", "Token não encontrado");
    });
  });

  describe('Quando é passado um token invalido na requisição', () => {
    it('retorna status 401 com a menssagem "Token invalido ou expirado"',async () => {
      const response = await chai.request(server)
      .post("/User")
      .set("Authorization", "token invalido")

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message", "Token invalido ou expirado");
    });
  });

  describe('Ao passar um body na requisição com o formato incorreto', () => {

    it(`Sem o campo fullName, 
          retorna status 400 com a menssagem "fullName is required"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "occupation": "administrador",
          "email": "malves224@clewsat.com",
          "contact": "1195424244",
          "password": "123456789",
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "fullName is required");
  
    });

    it(`campo fullName não sendo string,
           retorna status 400 com a menssagem "fullName must be a string"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": 12,
          "occupation": "administrador",
          "email": "malves224@clewsat.com",
          "contact": "1195424244",
          "password": "123456789",
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "fullName must be a string");
    });

    it(`campo fullName com menos de 3 caracteres,
           retorna status 400 com a menssagem "fullName must be longer than 2 characters"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MA",
          "occupation": "administrador",
          "email": "malves224@clewsat.com",
          "contact": "1195424244",
          "password": "123456789",
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "fullName must be longer than 2 characters");
    });

    it(`Sem o campo occupation,
           retorna status 400 com a menssagem "occupation is required"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "email": "malves224@clewsat.com",
          "contact": "1195424244",
          "password": "123456789",
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "occupation is required");
    });

    it(`campo occupation não sendo string,
           retorna status 400 com a menssagem "occupation must be a string"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": 12,
          "email": "malves224@clewsat.com",
          "contact": "1195424244",
          "password": "123456789",
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "occupation must be a string");
    });
    
    it(`campo occupation com menos de 3 caracteres,
           retorna status 400 com a menssagem "occupation must be longer than 2 characters"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "ve",
          "email": "malves224@clewsat.com",
          "contact": "1195424244",
          "password": "123456789",
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "occupation must be longer than 2 characters");
    });

    it(`Sem o campo email,
           retorna status 400 com a menssagem "email is required"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "vendedor",
          "contact": "1195424244",
          "password": "123456789",
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "email is required");
    });

    it(`campo email não sendo string,
           retorna status 400 com a menssagem "email must be a string"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "vendedor",
          "email": 123,
          "contact": "1195424244",
          "password": "123456789",
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "email must be a string");
    });

    it(`campo email com formato invalido,
           retorna status 400 com a menssagem "Email com formato invalido"`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "vendedor",
          "email": "malves224",
          "contact": "1195424244",
          "password": "123456789",
          "idPerfil": 1
        })
      .set("Authorization", token);

      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "Email com formato invalido.");

      const response2 = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "vendedor",
          "email": "malves224@gmail",
          "contact": "1195424244",
          "password": "123456789",
          "idPerfil": 1
        })
      .set("Authorization", token);

  
      expect(response2).to.have.status(400);
      expect(response2.body).to.have.property("message", "Email com formato invalido.");

    });

    it(`Sem o campo contact,
           retorna status 400 com a menssagem "contact is required`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "vendedor",
          "email": "malves224@outlook.com",
          "password": "123456789",
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "email is required");
    });

    it(`campo contact não sendo string,
           retorna status 400 com a menssagem "contact must be a string`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "vendedor",
          "email": "malves224@outlook.com",
          "contact": 1234,
          "password": "123456789",
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "email must be a string");
    });

    it(`Campo contact invalido,
           retorna status 400 com a menssagem "contact check msg patern regex`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "vendedor",
          "email": "malves224@outlook.com",
          "contact": "1185424244",
          "password": "123456789",
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "email check msg patern regex");
    });

    it(`Sem o Campo password,
           retorna status 400 com a menssagem "password is required`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "vendedor",
          "email": "malves224@outlook.com",
          "contact": "1195424244",
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "password is required");
    });

    it(`campo password não sendo string,
           retorna status 400 com a menssagem "password must be a string`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "vendedor",
          "email": "malves224@outlook.com",
          "contact": "1195424244",
          "password": 1234,
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "password must be a string");
    });

    it(`Campo password tendo menor que 8 caracteres,
           retorna status 400 com a menssagem "password must be longer than 2 characters`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "vendedor",
          "email": "malves224@outlook.com",
          "password": "123",
          "contact": "1195424244",
          "idPerfil": 1
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "password must be longer than 2 characters");
    });

    it(`Sem o Campo idPerfil,
           retorna status 400 com a menssagem "idPerfil is required`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "vendedor",
          "email": "malves224@outlook.com",
          "password": "123456789",
          "contact": "1195424244",
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "idPerfil is required");
    });

    it(`Campo idPerfil não sendo um numero,
           retorna status 400 com a menssagem "idPerfil must be a number`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "vendedor",
          "email": "malves224@outlook.com",
          "password": "123456789",
          "contact": "1195424244",
          "idPerfil": "asd"
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "idPerfil must be a number");
    });

    it(`Campo idPerfil que não existe,
           retorna status 400 com a menssagem "O perfil atribuido não existe."`, async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
      });
  
      const response = await chai.request(server)
      .post("/User")
      .send({
          "fullName": "MATHEUS ALVES",
          "occupation": "vendedor",
          "email": "malves224@outlook.com",
          "password": "123456789",
          "contact": "1195424244",
          "idPerfil": 9999
        })
      .set("Authorization", token);
  
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message", "O perfil atribuido não existe.");
    });

  });

  describe('Ao tentar cria usuário, sem a permissão', () => {
    it('Retorna status 401, com a menssagem "Usuario não autorizado."', async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[1].login,
        password: "987654321"
        });

      const response = await chai.request(server)
        .post("/User")
        .send({
          "fullName": "MATHEUS ALVES DE OLIVEIRA",
          "occupation": "administrador",
          "email": "malves224@clewsat.com",
          "contact": "1195424244",
          "password": "123456789",
          "idPerfil": 1,
        })
        .set("Authorization", token);

         expect(response).to.have.status(401);
         expect(response.body).to.have.property("message", "Usuario não autorizado.");
    });
  });

  describe('Ao criar usuário', () => {
    it('Retorna status 201, com os dados do usuario criado sem o password', async () => {
      const { body: { token } } = await chai.request(server)
      .post("/Login")
      .send({
        login: fakeUserDB[0].login,
        password: "123456789"
        });

      const response = await chai.request(server)
        .post("/User")
        .send({
          "fullName": "MATHEUS ALVES DE OLIVEIRA",
          "occupation": "administrador",
          "email": "teste@clewsat.com",
          "contact": "1195424244",
          "password": "123456789",
          "idPerfil": 1,
        })
        .set("Authorization", token);

         expect(response).to.have.status(401);
         // expect(response.body).to.have.property("message", "Usuario não autorizado.");
    });
  });

});