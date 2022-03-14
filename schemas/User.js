const Joi = require('joi');

const checkDataLogin = ({ login, password }) => {
  if (!login) {
    return { message: '"Login" é obrigatório' };
  }
  if (!password) {
    return { message: '"Senha" é obrigatório' };
  }
  return {};
};

const typeCustomMessages = {
  email: {
    'string.pattern.base': 'Email com formato invalido.',
  },
  contact: {
    'string.pattern.base': 'Telefone celular com formato invalido.',
  },
};

const schemaNewUser = Joi.object({
  fullName: Joi.string().required().min(3),
  occupation: Joi.string().required().min(3),
  email: Joi.string().required()
    .pattern(/^([\w-]+\.)*[\w\- ]+@([\w\- ]+\.)+([\w-]{2,3})$/)
    .messages(typeCustomMessages.email),
  contact: Joi.string().required()
    .pattern(/^[1-9]{2}(?:[2-8]|9[1-9])[0-9]{3}[0-9]{4}$/)
    .messages(typeCustomMessages.contact),
  password: Joi.string.required().min(8),
  idPerfil: Joi.number.required(),
});

const userValidate = async (newProfile) => {
  try {
    await schemaNewUser.validateAsync(newProfile);
  } catch ({ details }) {
    const messageErro = details[0].message;
    console.log(details);
    const newErro = new Error(messageErro);
    throw newErro;
  }
};

module.exports = {
  checkDataLogin,
  userValidate,
};