const { Router } = require('express');
const shopController = require('./shop');
const chaosController = require('./chaos');
const healthController = require('./health');
const loginController = require('./login');
const csrfController = require('./csrf');

module.exports = async function initControllers() {
  const router = Router();
  router.use('/api/shop', await shopController());
  router.use('/api/chaos', await chaosController());
  router.use('/api/health', await healthController());
  router.use('/api/login', await loginController());
  router.use('/api/csrf', await csrfController());
  return router;
};
