const checkDataLogin = ({ login, password }) => {
  if (!login) {
    return { message: '"Login" é obrigatório' };
  }
  if (!password) {
    return { message: '"Senha" é obrigatório' };
  }
  return {};
};

module.exports = {
  checkDataLogin,
};