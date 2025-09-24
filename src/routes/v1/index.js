const express = require('express');
const testRoutes = require('./test/test.route');
const imessageRoutes = require('./imessage.route');

const authApp = require('../../middlewares/auth-app'); 
const authLocal = require('../../middlewares/auth');
const authDispatch = require('../../middlewares/auth-dispatch'); 
const authRoutes = require('./auth/auth.route'); 

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
    private: false,
  },
  {
    path: '/',
    route: testRoutes,
    private: false,
  },
  {
    path: '/imessage',
    route: imessageRoutes,
    private: false,
  },
  
  
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.private ? authDispatch : (req, res, next) => next(), route.route);
});

module.exports = router;
