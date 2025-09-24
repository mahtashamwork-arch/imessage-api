const { Strategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const User = require('../models/user/user.model');
const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtVerify = async (payload, done) => {
  try {
     const { id } = payload;
    const user = await User.findByPk(id); 
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};
const jwtStrategy = new Strategy(jwtOptions, jwtVerify);
module.exports = {
  jwtStrategy,
};
