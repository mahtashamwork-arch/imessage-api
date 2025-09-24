const passport = require('passport');

const auth = (req, res, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        message: 'User is not authenticated!',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = auth;
