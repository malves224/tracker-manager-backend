require('dotenv').config();
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { user } = require('../models');
const { User: UserSchema } = require('../schemas');
const { verifyIfPerfilExist, MSG_USER_NO_AUTH } = require('./Profiles');
const { verifyPermissionAction } = require('./util');

const secret = process.env.JWT_SECRET;
const MSG_PERFIL_NOT_EXIST = 'O perfil atribuido não existe.';

const generateHash = async (password) => {
  try {
    const hashValue = await argon2.hash(password);
    const hashStringDismembered = hashValue.split('$');
    const onlyHash = hashStringDismembered[hashStringDismembered.length - 1];
    return onlyHash;
  } catch (error) {
    console.log(error.message);
  }
};

const checkPasswordHash = async (password, hash) => {
  try {
    const isValid = await argon2
      .verify(`$argon2i$v=19$m=4096,t=3,p=1$${hash}`, password);
    return isValid;
  } catch (error) {
    console.log(error.message);
  }
};

function generateToken(data) {
  const jwtConfig = {
    expiresIn: '1d',
    algorithm: 'HS256',
  };
  const token = jwt.sign(data, secret, jwtConfig);
  return token;
}

const authenticateUser = async ({ login, password }) => {
  const userData = await user.findOne({ where: { login } });
  if (!userData) {
    return { message: 'Usuario não cadastrado.' };
  }
  const passwordIsCorrect = await checkPasswordHash(password, userData.password);
  if (!passwordIsCorrect) {
    return { message: 'Senha inválida.' };
  }
  return userData;
};

const login = async (loginData) => {
  const dataIsValid = UserSchema.checkDataLogin(loginData);
  if (dataIsValid.message) {
    return { code: 400, message: dataIsValid.message };
  }
  const userAuthenticated = await authenticateUser(loginData);
  if (userAuthenticated.message) {
    return { code: 401, message: userAuthenticated.message };
  }

  const { id, idPerfil, login: loginUser } = userAuthenticated;
  const token = generateToken({ id, idPerfil, login: loginUser });
  return token;
};

const createNewUser = async (newUserData) => {
  const hashPassword = await generateHash(newUserData.password);
  const response = await user.create({ ...newUserData, password: hashPassword });
  return response;
};

const mainCreate = async (idPerfilUserCurrent, newUSerData) => {
  const [entity, action] = ['users', 'create'];
  const { fullName, occupation, email, contact, password, idPerfil } = newUSerData;

  const [perfilExist, content] = await verifyIfPerfilExist(+idPerfil, MSG_PERFIL_NOT_EXIST);
  if (!perfilExist) {
    return { code: 400, message: content };
  }
  const canCreate = await verifyPermissionAction(idPerfilUserCurrent, { entity, action });
  if (!canCreate) {
    return { code: 401, message: MSG_USER_NO_AUTH };
  }

  const { id } = await
  createNewUser({ fullName, occupation, login: email, contact, password, idPerfil });
  return { id, fullName, occupation, email, contact, idPerfil };
};

module.exports = {
  login,
  create: mainCreate,
};
