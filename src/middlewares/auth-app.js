const { validateTokenExternally } = require('../services/auth/auth.service');

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  const user = await validateTokenExternally(token);
  if (!user) return res.status(401).json({ message: 'Invalid token' });
  req.user = user;
  next();
};

module.exports = auth;
