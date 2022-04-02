const jwt = require('jsonwebtoken');

require('dotenv').config();

const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if(!token) {
    return res.status(401).json({message: "Token não encontrado"})
  }

  try {
    const userInfo = jwt.verify(token, secret);
    req.userAuthenticated = userInfo;
    next();
  } catch (error) {
    return res.status(401).json({message: "Token invalido ou expirado"})
  }
};
