require('dotenv').config();
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { user } = require('../models');
const { User: UserSchema } = require('../schemas');

const secret = process.env.JWT_SECRET;

// eslint-disable-next-line no-unused-vars
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

module.exports = {
  login,
};