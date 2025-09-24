const authApp = require('./auth-app');
const authLocal = require('./auth');

const authDispatch = (req, res, next) => {
  const authType = req.headers.authtype?.toLowerCase();
    console.log('Auth Type:', authType);
  if (authType === 'local') {
    return authLocal(req, res, next);
  } else{
    return authApp(req, res, next);
  } 
};

module.exports = authDispatch;
