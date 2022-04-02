const Joi = require('joi');

const typeCustomMessages = {
  name: {
    'any.required': 'Name is required',
    'string.base': 'Name must be a string',
    'string.min': 'Name must be longer than 2 characters',
  },
  pages: {
    'any.required': 'pages is required',
    'array.base': 'pages must be a array',
    'number.base': 'idPage must be a number',
    'boolean.base': 'edit, create, delete must be a boolean',
  },
};

const schemaNewProfile = Joi.object({
  name: Joi.string()
    .required().min(3).messages(typeCustomMessages.name),
  pages: Joi.array().required()
    .items(Joi.object({
      idPage: Joi.number().strict().required(),
      edit: Joi.boolean().strict(),
      delete: Joi.boolean().strict(),
      create: Joi.boolean().strict(),
    })).messages(typeCustomMessages.pages),
});

const profile = async (newProfile) => {
  try {
    await schemaNewProfile.validateAsync(newProfile);
  } catch ({ details }) {
    const messageErro = details[0].message;
    const newErro = new Error(messageErro);
    throw newErro;
  }
};

module.exports = { profile };
