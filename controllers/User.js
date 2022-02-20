const { User } = require('../service');

const login = async (req, res) => {
  const responseLogin = await User.login(req.body);
  if (responseLogin.message) {
    return res.status(responseLogin.code).json({ message: responseLogin.message });
  }
  
  res.status(201).json({ token: responseLogin });
};

module.exports = {
  login,
};