const jwt = require('jsonwebtoken');
const NoRightsError = require('./errors/noRightsError');

const { NODE_ENV, JWT_SECRET } = process.env;
console.log(NODE_ENV);
function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NoRightsError('Нет доступа'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new NoRightsError('Нет доступа'));
  }

  req.user = payload;
  next();
}

module.exports = {
  auth,
};
