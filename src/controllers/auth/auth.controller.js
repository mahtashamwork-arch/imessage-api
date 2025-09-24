const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/user/user.model'); // adjust if needed
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const ms = require('ms');
const { validateTokenExternally } = require('../../services/auth/auth.service');

exports.login = async (req, res) => {
  const { email } = req.body;
    console.log('Login attempt for username:', email);
  try {
    // Find user by username
   const user = await User.findOne({
      where: {
        [Op.or]: [
          { email } 
        ]
      }
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials (user not found)' });
    }
    const autAppUser  = await validateTokenExternally(req.headers.authorization?.split(' ')[1]);
    if (!autAppUser) {
      return res.status(401).json({ message: 'Invalid credentials (token validation failed)' });
    }

   const tokenId = uuidv4();
   const {  ...userData } = user.get({ plain: true });
    const payload = {
      ...userData,
      jti: tokenId, 
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.json({ token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.verify = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const authAppUser = await validateTokenExternally(token);
    if (!authAppUser) {
      return res.status(401).json({ valid: false, message: 'Invalid or expired token' });
    }
     const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: authAppUser.email }, 
        ]
      }
    });
    if (!user) {
      return res.status(401).json({ valid: false, message: 'User not found' });
    }
    return res.json({ valid: true, user });
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ valid: false, message: 'Invalid or expired token' });
  }
};

